import { Fef } from './fef/fef';

const processor = new Fef('../../data/input2.csv', 'csv', {
	debug: {
		limit: 5,
	},
});

processor.setInputPreparation((item) => {
	const [address, statusCode, status, ...links] = Object.values(item);
	const validLinks = links.filter((link) => link);

	if (validLinks.length) {
		return {
			address,
			links: validLinks,
		};
	}
	else {
		return undefined;
	}
});

processor.run();
