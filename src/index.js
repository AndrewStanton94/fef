import { Fef } from './fef/fef';
const { JSDOM } = require('jsdom');

const processor = new Fef('../../data/dataPort.csv', 'csv', {
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
		const textContent = a.textContent;
		let hostname = '';
		try {
			hostname = new URL(href).hostname;
		} catch (error) {
			console.warn(`Invalid input on page: ${address} => ${href}` );
			hostname = `INVALID: ${href}`;
		}

		return {
			href,
			textContent,
			hostname
		};
	}).filter(({hostname}) => hostname.includes('port.ac.uk') || hostname.includes('INVALID'));

	return localURLsOpeningInNewTabs.map(({href, textContent, hostname}) => ({
		page: address,
		textContent,
		hostname,
		linksTo: href
	}));
});

processor.run('../../data/out/dataPort.csv');
