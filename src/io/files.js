const fs = require('fs');
const { join } = require('path');

const absFilePath = (relPath) => join(__dirname, relPath);

export const getLocalFile = (url) =>
	new Promise((resolve, reject) => {
		const absURL = absFilePath(url);
		console.log('Fetching from this path: ', absURL);

		fs.readFile(absURL, (err, data) => {
			if (err) {
				console.error('Issue getting the file:');
				reject(err);
			}

			resolve(data);
		});
	});

const writeFile = (relPath, data) => {
	fs.writeFile(absFilePath(relPath), data, (err) => {
		if (err) throw err;
		console.log('Saved!', relPath);
	});
};

export const saveLocalFile = (fef, relPath) => {
	writeFile(relPath, fef.data.export);
};

export const writeJSON = (relPath, data) =>
	writeFile(relPath, JSON.stringify(data));
