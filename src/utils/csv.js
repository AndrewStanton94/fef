const Papa = require('papaparse');

/** Takes a string of CSV and converts it to JSON
 *
 * @param {string} csv The CSV data
 * @returns {string[][]} The data as a list of lists
 */
function csvToJSON(csv) {
	let { data } = Papa.parse(csv, { skipEmptyLines: true });
	return data;
}

/** Takes JSON  and converts it into a string of CSV
 *
 * @param {string[][]} json The data as a list of lists
 * @returns {string} The CSV data
 */
function jsonToCSV(json) {
	let data = Papa.unparse(json, {
		columns: [
			'Page title',
			'URL',
			'Device',
			'Hero needs changing (e.g. too stocky, dull, doesn’t represent content, blurry)',
			'Hero missing straplines',
			'Content needs improving (e.g. not TOV’d, not engaging, too long, etc)',
			'Content is missing (e.g. staff profile cards missing from research group pages) ',
			'Page layout needs improvement (e.g. better use of images or components) ',
			'Left hand nav missing (only on pages that need it)',
			'Left hand nav order is illogical',
			'If landing page, wayfinding items are in illogical order',
			'If landing page, images have gender or racial imbalance',
			'If wayfinding image and hero image are visibly different',
			'Incorrect page template or page layout used incorrectly (e.g. right hand space not being used)',
			'Broken links ',
			'Links to Myport, UoP news or the UoP staff site',
			'Mobile phone and email links aren’t clickable ',
			'Email links aren’t spelled out (the email address should be visible)',
			'External links don’t open in a new window',
			'Internal links open in a new window (they shouldn’t)',
			'Anchor text needs improving (e.g. says ‘click here’ or uses a URL path)',
			'No CTA at end of page',
			'Page structure is wrong (e.g. incorrect htag order)',
			'Inaccessible multimedia (e.g. no captions on video, no alt text on images)',
			'Copy formatting issues (e.g. wrong colour, Word markup remains)',
			'Missing relevant promotional content (e.g. open days promos on course pages, right hand promos on news stories)',
			'Component bugs (e.g. A-Z search not working, component misaligned on mobile)',
			'Other UX issues (e.g. incorrect components used, confusing instructions for forms, strange user journey - please indicate)',
			'Critical info too far down page',
			'Missing content ',
			'Any other comments',
		],
	});
	return data;
}

module.exports = { csvToJSON, jsonToCSV };
