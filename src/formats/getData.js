import { csvToJSON, jsonToCSV } from './csv';
import listsToObjects from '../utils/listsToObjects';

export const mimes = {
	csv: 'text/csv',
	json: 'application/json'
};

const extractionMethods = {
	csv: (fileData, fef) => {
		const jsonData = csvToJSON(fileData);
		return listsToObjects(jsonData[0], jsonData.slice(1));
	},
	json: (data) => JSON.parse(data)
};

const exportPrepMethods = {
	csv: (dataToPrepareForExport) => jsonToCSV(dataToPrepareForExport),
	json: (data) => JSON.stringify(data)
};

export const extractData = (data, dataType, debugging, debugOptions) => {
	let extractedData = extractionMethods[dataType](data);

	if (debugging && debugOptions && debugOptions.limit) {
		extractedData = extractedData.slice(0, debugOptions.limit);
	}

	return extractedData;
};

export const setData = (format, data) => {
	return exportPrepMethods[format](data);
};
