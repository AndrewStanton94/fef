import { csvToJSON, jsonToCSV } from './csv';
import listsToObjects from '../utils/listsToObjects';

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
 * @typedef {('csv'|'json')} IOFormats
 * @typedef {string} JSONString
 */

/**
 * Supported mime types
 */
export const mimes = {
	csv: 'text/csv',
	json: 'application/json'
};

/**
 * Methods that take received data and convert to a usable format
 */
const extractionMethods = {
	/** Process a CSV file, return as objects
	 * @param  {string} fileData
	 * @returns {Object[]}
	 */
	csv: (fileData) => {
		const jsonData = csvToJSON(fileData);
		return listsToObjects(jsonData[0], jsonData.slice(1));
	},
	/** Process a JSON file
	 * @param  {JSONString} fileData - A JSON string
	 * @returns {Object[]}
	 */
	json: (fileData) => JSON.parse(fileData)
};

/**
 * Methods to prepare data for export
 */
const exportPrepMethods = {
	/** Convert to CSV format
	 * @param  {Object[]} dataToPrepareForExport
	 * @returns {string} Data as a string that can be saved
	 */
	csv: (dataToPrepareForExport) => jsonToCSV(dataToPrepareForExport),
	/**
	 * @param  {Object[]} dataToPrepareForExport
	 * @returns  {JSONString} JSON string
	 */
	json: (dataToPrepareForExport) => JSON.stringify(dataToPrepareForExport)
};

/** Convert file content with a given filetype to data
 * @param  {string} data
 * @param  {IOFormats} dataType
 * @param  {boolean} debugging
 * @param  {DebugOptions} debugOptions
 * @returns {Object[]}
 */
export const extractData = (data, dataType, debugging, debugOptions) => {
	let extractedData = extractionMethods[dataType](data);

	if (debugging && debugOptions && debugOptions.limit) {
		extractedData = extractedData.slice(0, debugOptions.limit);
	}

	return extractedData;
};

/** Convert data to given format for exporting
 * @param  {IOFormats} format
 * @param  {Object[]} data
 */
export const setData = (format, data) => {
	if (!format) {
		throw new Error('setData didn\'t receive a format');
	}
	return exportPrepMethods[format](data);
};
