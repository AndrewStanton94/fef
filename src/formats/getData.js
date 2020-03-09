import { csvToJSON, jsonToCSV } from './csv';
import listsToObjects from '../utils/listsToObjects';

const extractionMethods = {
	csv: (fileData, fef) => {
		const jsonData = csvToJSON(fileData);
		return listsToObjects(jsonData[0], jsonData.slice(1));
	},
};

const exportPrepMethods = {
	csv: (dataToPrepareForExport) => jsonToCSV(dataToPrepareForExport),
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
