const fs = require('fs');
const { join } = require('path');

const absFilePath = (relPath) => join(__dirname, relPath);

const readFile = (relPath) =>
	fs.readFileSync(absFilePath(relPath), { encoding: 'utf8' });

const writeFile = (relPath, data) => {
	fs.writeFile(absFilePath(relPath), data, (err) => {
		if (err) throw err;
		console.log('Saved!', relPath);
	});
};

const writeJSON = (relPath, data) => writeFile(relPath, JSON.stringify(data));

module.exports = {
	readFile,
	writeFile,
	writeJSON,
};
