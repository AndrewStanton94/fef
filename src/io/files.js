const fs = require('fs');
const { join } = require('path');

const absFilePath = (relPath) => join(__dirname, relPath);

export const getLocalFile = (fef) => {
	console.log(fef.url);
	const fileData = fs.readFileSync(absFilePath(fef.url), {
		encoding: 'utf8',
	});

	fef.data.fileData = fileData;
	return fef;
};

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
