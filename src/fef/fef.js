import { getLocalFile, saveLocalFile, writeJSON } from '../io/files';
import { getFromBrowser, saveToDevice } from '../io/browser';
import { extractData, setData, mimes } from '../formats/getData';
import { processData } from './processData';

/** Options for debugging and development
 * @typedef {Object} DebugOptions
 * @property {number} limit - Only use the first n data items
 */
/** Options for use in the browser
 * @typedef {Object} BrowserOptions
 * @property {HTMLElement} downloadLinkElem
 * @property {function()} displayDownloadLink
 */
/** Configure Fef
 * @typedef {Object} FefOptions
 * @property {?DebugOptions} debug
 * @property {?BrowserOptions} browser
 */

/**
 * @typedef {string} url
 * @typedef {('csv'|'json')} IO-Formats
 */

/** The For-Each Files class
 */
export class Fef {
	supportedMimes = mimes;
	stats = {
		receivedData: 0,
		dataToProcess: 0,
		validData: 0,
	};
	data = {
		extractedData: [],
		validData: [],
		processed: [],
	};

	/** Create a For-Each File processor
	 * @param  {url} url - Where the input file is
	 * @param  {IO-Formats} dataType - What file type
	 * @param  {?FefOptions} options={} - Configure the processor
	 */
	constructor(url, dataType, options = {}) {
		this.url = url;
		this.dataType = dataType;
		this.options = options;
		this.mime = mimes[dataType] || undefined;

		if (typeof this.mime === 'undefined') {
			console.warn(`This format ${dataType} doesn't have a mime.`);
		}
	}
	/** Export given data to a JSON file
	 * @param  {string} relPath
	 * @param  {Array} data
	 */
	saveJSON(relPath, data) {
		writeJSON(relPath, data);
	}
	/** Are there any debug options and what are they?
	 * @returns {[boolean, DebugOptions]}
	 */
	isDebug() {
		const { debug } = this.options;
		if (debug) {
			return [true, debug];
		} else {
			return [false, null];
		}
	}

	/** [Optional] Set a function to be called on each item of input.
	 * Use this to prepare the data for processing.
	 * @param  {function():} filter
	 */
	setInputPreparation(filter) {
		this.inputPreparation = filter;
	}

	/** Set the transformation to use on each data item
	 * @param  {function():} transformation
	 */
	setItemTransformation(transformation) {
		this.transformation = transformation;
	}

	/** Set the validation to apply to the collection
	 * @param  {function():} validation
	 */
	setPostProcessValidation(validation) {
		this.postProcessValidation = validation;
	}

	// Stages
	/** Fetch the data from the file. Uses the URL from class creation
	 * @returns {Promise<string>} - Resolves to file contents
	 */
	getFile() {
		const {url} = this;
		// TODO Add support for remote files
		if (url.startsWith('#')) {
			return getFromBrowser(url).catch((err) => {
				throw err;
			});
		}
		return getLocalFile(url).catch((err) => {
			throw err;
		});
	}
	/** Take the raw data, get info from a parser and updates Fef
	 * @param  {Object[]} data
	 * @param  {Fef} fef
	 * @returns {Fef}
	 */
	extractDataFromFile(data, fef) {
		const extractedData = extractData(data, fef.dataType, ...fef.isDebug());
		fef.stats.receivedData = extractedData.length;
		fef.data.extractedData = extractedData;
		return fef;
	}

	/** Prepare and process the data
	 * @param  {Fef} fef
	 * @returns {Fef}
	 */
	process(fef) {
		return processData(fef);
	}

	/** Perform user specified post-processing and filtering
	 * @param  {Fef} fef
	 * @returns {Fef}
	 */
	validate(fef) {
		if (typeof fef.postProcessValidation !== 'undefined') {
			const dataToValidate = fef.data.processed;
			const validated = fef.postProcessValidation(dataToValidate);
			fef.stats.validData = validated.length;
			fef.data.validated = validated;
			return fef;
		}
		return fef;
	}
	/** Save the results to a file
	 * @param  {IO-Formats} format
	 * @param  {url} outputPath
	 * @param  {Fef} fef
	 */
	save(format, outputPath, fef) {
		// fef.options.browser.displayDownload();
		const { data } = fef;
		const dataToSave = data.validated ? data.validated : data.processed;
		const exportableData = setData(format, dataToSave);

		if (fef.options.platform === 'browser') {
			saveToDevice(
				exportableData,
				outputPath,
				fef.mime,
				fef.options.browser.downloadLinkElem,
				fef.options.browser.displayDownloadLink
			);
		} else {
			saveLocalFile(exportableData, outputPath);
		}
		return fef;
	}
	/** Process the file and save the output
	 * @param  {url} outputPath
	 * @param  {IO-Formats} format
	 */
	run(outputPath, format) {
		this.getFile()
			.then((data) => this.extractDataFromFile(data, this))
			.then(() => this.process(this))
			.then(() => this.validate(this))
			.then(() => this.save(format, outputPath, this))
			.then((x) => console.log('from process: ', x))
			.catch((err) => console.error(err));
	}
}
