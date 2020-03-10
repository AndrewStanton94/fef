import { Fef } from './fef/fef';

// console.log(Fef);

window.addEventListener('load', () => {
	const processor = new Fef('#uploadForm', 'csv', { platform: 'browser' });
	processor.run();
});
