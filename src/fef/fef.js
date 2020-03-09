import { getLocalFile, saveLocalFile, writeJSON } from '../io/files';
import { extractData, setData } from '../formats/getData';
import { processData } from './processData';
import checkLinks from './checkLinks';

export class Fef {
	constructor(url, dataType, options = {}) {
		this.url = url;
		this.dataType = dataType;
		this.data = {};
		this.options = options;
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

	save(format) {
		console.log(Object.keys(this.data));
		setData(this);
		saveLocalFile(this, '../../data/out/data.csv');
	}

	run() {
		this.getFile()
			.then((data) => this.extractDataFromFile(data, this))
			.then(() => this.process(this))
			.then((x) => console.log('from process: ', x))
			.catch((err) => console.error(err));

		// this.process();
		// this.save('csv');
	}
}
