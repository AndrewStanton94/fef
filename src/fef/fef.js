import { getLocalFile, saveLocalFile, writeJSON } from '../io/files';
import { getFromBrowser } from '../io/browser';
import { extractData, setData } from '../formats/getData';
import { processData } from './processData';
import checkLinks from './checkLinks';

export class Fef {
	constructor(url, dataType, options = {}) {
		this.url = url;
		this.dataType = dataType;
		this.data = {};
		this.options = options;
		this.mime = mimes[dataType] || undefined;

		if (typeof this.mime === 'undefined') {
			console.warn(`This format ${dataType} doesn't have a mime.`);
		}
	}

	saveJSON(relPath, data) {
		writeJSON(relPath, data);
	}

	isDebug() {
		const debug = this.options.debug;
		if (debug) {
			return [true, debug];
		} else {
			return [false, null];
		}
	}

	// Would-be Setters
	setInputPreparation(filter) {
		this.inputPreparation = filter;
	}

	setItemTransformation(transformation) {
		this.transformation = transformation;
	}

	setPostProcessValidation(validation) {
		this.postProcessValidation = validation;
	}

	// Stages
	getFile() {
		// TODO Add support for remote files
		if (this.url.startsWith('#')) {
			return getFromBrowser(this.url).catch((err) => {
				throw err;
			});
		}
		return getLocalFile(this.url).catch((err) => {
			throw err;
		});
	}

	extractDataFromFile(data, fef) {
		const extractedData = extractData(data, fef.dataType, ...fef.isDebug());
		fef.data.extractedData = extractedData;
		return fef;
	}

	process(fef) {
		return processData(fef);
	}

	resultValidation() {
		const dataToValidate = this.data.processed;
		const validated = checkLinks(dataToValidate);
		this.data.validated = validated;
		return;
	}

	save(format, outputPath, fef) {
		const exportableData = setData(format, fef.data.processed);
		saveLocalFile(exportableData, outputPath);
		return fef;
	}

	run(outputPath) {
		this.getFile()
			.then((data) => this.extractDataFromFile(data, this))
			.then(() => this.process(this))
			.then(() => this.save('csv', outputPath, this))
			.then((x) => console.log('from process: ', x))
			.catch((err) => console.error(err));
	}
}
