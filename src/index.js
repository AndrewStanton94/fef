import { Fef } from './fef/fef';

const processor = new Fef('../../data/input.csv', 'csv', {
});

processor.setItemTransformation((row1) => {
	const row2 = {...row1};
	row1.Device = 'Desktop';
	row2.Device = 'Mobile';
	return [row1, row2];
});

processor.run();
