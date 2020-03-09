import { yeahNah } from '../utils/utils';

export const processData = (fef) => {
	console.log(
		`There are ${fef.data.extractedData.length} items from the file`
	);

	if (fef.inputPreparation) {
		console.log('Will filter');

		const preparedItems = fef.data.extractedData
			.map(fef.inputPreparation)
			.filter((item) => typeof item !== 'undefined');
		console.log(`${preparedItems.length} remain after input preparation`);
		fef.data.validData = preparedItems;
	} else {
		console.log('Won\'t filter');
		fef.data.validData = fef.data.extractedData;
	}

	const processedData = fef.data.validData.flatMap(fef.transformation);
	fef.data.processed = processedData;

	// fef.saveJSON('../../data/debug/processedData.json', processedData);

	return fef;
};
