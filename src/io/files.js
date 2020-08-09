const fs = require('fs');
const { join } = require('path');

/** Create an absolute filepath from a relative one
 * @param  {string} relPath
 * @returns {string} Absolute file path
 */
const absFilePath = (relPath) => join(__dirname, relPath);

/** Get the contents of a file on the local machine
 * @param  {string} url
 * @returns {string} File content
 */
export const getLocalFile = (url) =>
	new Promise((resolve, reject) => {
		const absURL = absFilePath(url);
		console.log('Fetching from this path: ', absURL);

		fs.readFile(absURL, 'utf-8', (err, data) => {
			if (err) {
				console.error('Issue getting the file:');
				reject(err);
			}

			resolve(data);
		});
	});

/** Save data to file
 * @param  {string} exportableData
 * @param  {string} outputPath
 */
export const saveLocalFile = (exportableData, outputPath) => {
	fs.writeFile(absFilePath(outputPath), exportableData, (err) => {
		if (err) throw err;
		console.log('Saved!', outputPath);
	});
};

/** Convert to JSON and save file
 * @param  {string} relPath
 * @param  {string} data
 */
export const writeJSON = (relPath, data) =>
	saveLocalFile(JSON.stringify(data), relPath);
