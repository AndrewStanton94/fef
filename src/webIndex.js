import { Fef } from './fef/fef';

import axios from 'axios';

import { chunks } from './utils/karataev';
import { yeahNah } from './utils/utils';

// console.log(Fef);

window.addEventListener('load', () => {
	const processor = new Fef('#uploadForm', 'csv', {
		platform: 'browser',
		debug: { limit: 80 },
		browser: {
			downloadLinkElem: document.getElementById('downloadLink'),
			// From vue app
			// displayDownloadLink: this.setReadyToDownload,
		},
	});
	processor.setInputPreparation((academic) =>
		academic['Name variant > Known as name-0'] &&
		academic['UUID-1'] &&
		academic['Organisations > Email addresses > Email-2']
			? academic
			: undefined
	);

	processor.setItemTransformation((academic) => {
		const baseURL = 'https://researchportal.port.ac.uk/portal/en/persons/';

		/** Format the name for the URL
		 *
		 * @param {string} name The original name
		 * @returns {string} URL compatible name
		 */
		const deduplicate = (list) =>
			[...new Set(list)].map((str) => str.trim());
		const normaliseAcademicName = (name) =>
			name.replace(/\s/g, '-').toLowerCase();

		const name = academic['Name variant > Known as name-0'];
		const uuid = academic['UUID-1'];
		const emailString =
			academic['Organisations > Email addresses > Email-2'];
		const email = deduplicate(emailString.toLowerCase().split(', '));

		const url = `${baseURL}${normaliseAcademicName(
			name
		)}(${uuid})/publications.html`;
		return { url, name, uuid, email };
	});

	processor.setPostProcessValidation(
		(academics) =>
			new Promise((resolve, reject) => {
				const instance = axios.create();
				let exportAcademics;

				const requestURL = (academic, instance) =>
					instance
						.head(academic.url)
						.then(({ status, statusText, request }) => {
							let { url } = academic;
							const { path } = request;

							if (
								url.replace(
									'https://researchportal.port.ac.uk',
									''
								) !== path
							) {
								status = 301;
								statusText = 'Has been redirected';
							}

							const linkData = {
								url,
								status,
								statusText,
								path,
							};
							academic.linkData = linkData;

							return academic;
						})
						.catch(({ message }) => ({
							academic,
							error: message,
						}));

				chunks(
					academics,
					(academic) => requestURL(academic, instance),
					25
				).then((output) => {
					const {
						yeah: foundAcademics = [],
						nah: missingAcademics = [],
					} = yeahNah(
						(academic) => typeof academic.error === 'undefined',
						output
					);

					console.log('Valid items: ', foundAcademics);
					console.log('Rejections: ', missingAcademics);

					exportAcademics = foundAcademics.map(
						({ name, url, email }) => {
							return {
								name,
								url,
								email,
							};
						}
					);
					resolve(exportAcademics);
				});
			})
	);

	processor.run('testOut.csv', 'csv');
});
