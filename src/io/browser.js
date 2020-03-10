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

		elem.addEventListener('change', (changeEvent) => {
			const reader = new FileReader();
			const file = changeEvent.target.files[0];
			console.log(file);

			reader.readAsText(file);
			reader.onload = (loadEvent) => {
				const extractedData = loadEvent.target.result;
				console.log(extractedData);
				resolve(extractedData);
			};
			reader.onerror = (err) => {
				reject('An error from the FileReader: ', err);
			};
		});
	});
