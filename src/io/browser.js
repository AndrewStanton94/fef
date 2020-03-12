export const getFromBrowser = (elementId) =>
	new Promise((resolve, reject) => {
		console.log('Fetching the element with this id: ', elementId);

		const elem = document.querySelector(elementId);
		console.log('Found this element: ', elem);

		if (elem === null) {
			reject('This isn\'t an element?');
		}

		if (elem.type !== 'file') {
			reject('Not a file input element');
		}

		const reader = new FileReader();
		const file = document.getElementById('uploadForm').files[0];
		console.log(file);

		reader.readAsText(file);
		reader.onload = (loadEvent) => {
			const extractedData = loadEvent.target.result;
			console.log('Data extracted by FileReader: ', extractedData);
			resolve(extractedData);
		};
		reader.onerror = (err) => {
			reject('An error from the FileReader: ', err);
		};
	});

export const saveToDevice = (
	exportableData,
	fileName,
	mime,
	downloadLinkElem,
	displayDownloadLink
) => {
	const file = new File(exportableData.split('\n'), fileName, { type: mime });
	const url = URL.createObjectURL(file);

	downloadLinkElem.href = url;
	downloadLinkElem.download = fileName;

	displayDownloadLink();
};
