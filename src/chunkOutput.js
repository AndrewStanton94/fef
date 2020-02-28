const fs = require('fs');
const { join } = require('path');

const { splitToChunks } = require('./utils/karataev');
const { writeJSON } = require('./utils/files');

const absFilePath = (relPath) => join(__dirname, relPath);

const readFile = (relPath) => {
	const absPath = absFilePath(relPath);
	return fs.readFileSync(absPath, { encoding: 'utf8' });
};

const data = JSON.parse(readFile('../data/out/academics.json'));
const dataChunks = splitToChunks(data, 500);

dataChunks.forEach((data, i) => {
	const path = `../../data/chunks/academic-${i}.json`;
	writeJSON(path, data);
});
