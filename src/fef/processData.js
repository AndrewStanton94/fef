export const processData = async (fef) => {
	if (fef.prepareEachInput) {
		console.log(
			`There are ${fef.data.extractedData.length} items from the file`
		);
	}

	if (fef.inputPreparation) {
		console.log('Processing input');

		let preparedItems;
		/**
		 * Process input as individual items or as a single object
		 */
		if (fef.prepareEachInput) {
			preparedItems = fef.data.extractedData
				.map(fef.inputPreparation)
				.filter((item) => typeof item !== 'undefined');
		} else {
			const { items, processor } = await fef.inputPreparation(
				fef.data.extractedData,
				fef
			);
			preparedItems = items;
			fef = processor;
		}

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
