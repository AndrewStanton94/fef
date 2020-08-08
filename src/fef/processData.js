export const processData = (fef) => {
	console.log(
		`There are ${fef.data.extractedData.length} items from the file`
	);

	if (fef.inputPreparation) {
		console.log('Will filter');

		const preparedItems = fef.data.extractedData
			.map(fef.inputPreparation)
			.filter((item) => typeof item !== 'undefined');

		const itemsRemaining = preparedItems.length;
		fef.stats.dataToProcess = itemsRemaining;
		if (!itemsRemaining) {
			return Promise.reject('Filtering removed all items');
		}
		console.log(`${itemsRemaining} remain after input preparation`);

		fef.data.validData = preparedItems;
	} else {
		console.log('Won\'t filter');
		fef.data.validData = fef.data.extractedData;
	}

	const processedData = fef.data.validData.flatMap(fef.transformation);
	return Promise.all(processedData).then((results) => {
		fef.data.processed = results;

		fef.saveJSON('../../data/debug/processedData.json', results);

		return fef;
	});
};
