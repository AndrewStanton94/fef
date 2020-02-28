import { yeahNah } from '../utils/utils';

export const processData = (fef) => {
	console.log(
		`There are ${fef.data.extractedData.length} items from the file`
	);

	if (fef.inputFilter) {
	}
	else {
		fef.data.validData = fef.data.extractedData;

	}

	const processedData = fef.data.validData.flatMap(fef.transformation);
	fef.data.processed = processedData;

	fef.saveJSON('../../data/debug/processedData.json', processedData);

	return fef;
};
