const fs = require('fs');
const { join } = require('path');
import { writeFile } from '../utils/files';

const absFilePath = (relPath) => join(__dirname, relPath);

const readFile = (relPath) => {
	const absPath = absFilePath(relPath);
	return fs.readFileSync(absPath, { encoding: 'utf8' });
};

export const getLocalFile = (fef) => {
	console.log(fef.url);
	const fileData = readFile(fef.url);
	fef.data.fileData = fileData;
	return fef;
};

export const saveLocalFile = (fef, relPath) => {
	writeFile(relPath, fef.data.export);
};
