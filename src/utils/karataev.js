// Using the functions defined by Eugene Karataev
// Source https://dev.to/karataev/handling-a-lot-of-requests-in-javascript-with-promises-1kbb
// Code from Karataev, notes added by AndrewStanton94

/**
 * Promisify a function called over a list. All resolve concurrently
 * @param {string[]} items - The items to be passed to the function
 * @param {function} fn - The function to run for each argument
 * @returns {Promise} The setted promise.all
 */
function all(items, fn) {
	const promises = items.map((item) => fn(item));
	return Promise.all(promises);
}

/**
 * Promisify a function called over a list. Promises resolved sequentially.
 * @param {string[]} items - The items to be passed to the function
 * @param {function} fn - The function to run for each argument
 * @returns {Promise} The setted promise.all
 */
function series(items, fn) {
	let result = [];
	return items
		.reduce((acc, item) => {
			acc = acc.then(() => {
				return fn(item).then((res) => result.push(res));
			});
			return acc;
		}, Promise.resolve())
		.then(() => result);
}

/**
 * Break list into more manageable segments
 * @param {string[]} items - The array to break down
 * @param {number} [chunkSize]
 * @returns {string[][]} - A list of list chunks
 */
function splitToChunks(items, chunkSize = 50) {
	const result = [];
	for (let i = 0; i < items.length; i += chunkSize) {
		result.push(items.slice(i, i + chunkSize));
	}
	return result;
}

/**
 * Takes a list of items, breaks it into manageable chunks that can be ran in parallel
 * @param {string[]} items - The items to be passed to the function
 * @param {function} fn - The function to run for each argument
 * @param {number} [chunkSize]
 */
function chunks(items, fn, chunkSize = 50) {
	let result = [];
	const chunks = splitToChunks(items, chunkSize);
	return series(chunks, (chunk) => {
		return all(chunk, fn).then((res) => (result = result.concat(res)));
	}).then(() => result);
}

module.exports = {
	all,
	series,
	splitToChunks,
	chunks,
};
