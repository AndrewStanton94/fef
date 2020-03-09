import { Fef } from './fef/fef';
const { JSDOM } = require('jsdom');

const processor = new Fef('../../data/input2.csv', 'csv', {
	debug: {
		limit: 1,
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
	} else {
		return undefined;
	}
});

processor.setItemTransformation(({ address, links }) => {
	const localURLsOpeningInNewTabs = links.map((link) => {
		const fragment = JSDOM.fragment(link);
		const a = fragment.children[0];
		const href = a.href;

		return {
			href,
			hostname:  new URL(href).hostname
		};
	}).filter(({hostname}) => hostname.includes('port.ac.uk'));

	return localURLsOpeningInNewTabs.map(({href}) => ({
		page: address,
		linksTo: href
	}));
});

processor.run();
