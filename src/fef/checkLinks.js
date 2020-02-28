const axios = require('axios');

const { chunks } = require('../utils/karataev');
const { yeahNah } = require('../utils/utils');
const { writeJSON } = require('../utils/files');

const extractResponseData = (academic, response) => {
	let { url } = academic;
	let { status, statusText, request } = response;
	const { path } = request;

	if (url.replace('https://researchportal.port.ac.uk', '') !== path) {
		status = 301;
		statusText = 'Has been redirected';
	}

	const linkData = { url, status, statusText, path };
	academic.linkData = linkData;

	return academic;
};

const requestURL = (academic, instance) =>
	instance
		.head(academic.url)
		.then((response) => extractResponseData(academic, response))
		// .catch(({ response }) => extractResponseData(url, response));
		.catch(({ message }) => ({ academic, error: message }));

const instance = axios.create();

const checkLinks = (academics) =>
	chunks(academics, (academic) => requestURL(academic, instance), 25).then(
		(output) => {
			const {
				yeah: foundAcademics = [],
				nah: missingAcademics = [],
			} = yeahNah(
				(academic) => typeof academic.error === 'undefined',
				output
			);

			writeJSON('../../data/debug/foundAcademics.json', foundAcademics);
			writeJSON(
				'../../data/debug/missingAcademics.json',
				missingAcademics
			);

			const exportAcademics = foundAcademics.map(
				({ name, url, email }) => {
					return {
						name,
						url,
						email,
					};
				}
			);
			writeJSON('../../data/out/academics.json', exportAcademics);
		}
	);

module.exports = checkLinks;
