const coverLetter: HTMLElement | any = document.getElementById('cover_letter');
const nameElement: HTMLElement | any = document.getElementById('name');
const info: HTMLElement | any = document.getElementById('info');
const letterBody: HTMLElement | any = document.getElementById('letter_body');
const signature: HTMLElement | any = document.getElementById('sign');
let substitutionsForm: HTMLElement | any = document.getElementById(
	'substitutions'
);

interface placeholderDictionary {
	[placeholder: string]: string;
}

const coverLetterIDList: string[] = ['name', 'info', 'letter_body', 'sign'];
let substitutionsFormIDList: string[];
let placeholdersList: string[];
let substitutionsDict: placeholderDictionary;
let letterText: string;

// COVER LETTER SUBMIT
coverLetter.addEventListener('submit', (event: Event) => {
	// prevent the default behavior of the submit button
	event.preventDefault();

	console.log('Cover Letter Text Submitted!');
	const isFilled: boolean = isFormFilled(coverLetterIDList);
	console.log('isFormFilled(coverLetterIDList)', isFilled);

	if (!isFilled) {
		return;
	}

	const text =
		nameElement.value + info.value + letterBody.value + signature.value;

	letterText = text;
	console.log('text', text);

	placeholdersList = findPlaceholders(text);
	console.log('findPlaceholders(text)', placeholdersList);
	// save list of IDs for substitutions form for later
	substitutionsFormIDList = generateSubstitutionsForm(placeholdersList);
	console.log(
		'generateSubstitutionsForm(placeholdersList)',
		substitutionsFormIDList
	);
});

// SUBSTITUTIONS SUBMIT
substitutionsForm.addEventListener('submit', (event: Event) => {
	// prevent the default behavior of the submit button
	event.preventDefault();

	console.log('Substitutions form submitted!');
	const isFilled: boolean = isFormFilled(substitutionsFormIDList);
	console.log('isFormFilled(substitutionsFormIDList)', isFilled);

	if (!isFilled) {
		return;
	}

	let dict: placeholderDictionary = {};
	for (let i = 0; i < placeholdersList.length; i++) {
		const formItem: HTMLElement | any = document.getElementById(
			substitutionsFormIDList[i]
		);
		dict[placeholdersList[i]] = formItem.value;
	}

	substitutionsDict = dict;
	console.log('placeholderDict', dict);
	fillPlaceholders(letterText, substitutionsDict);
});

function isFormFilled(idList: string[]): boolean {
	let isFilled = true;
	idList.forEach(id => {
		const formItem: HTMLElement | any = document.getElementById(id);
		isFilled = isFilled && formItem.value != '';
	});

	return isFilled;
}

function generateSubstitutionsForm(placeholders: string[]): string[] {
	if (placeholders.length <= 0) {
		substitutionsForm.innerHTML = `<div>No substitutions</div>`;
		return [];
	}

	let idList: string[] = [];
	// clear out subs form to prevent clutter
	substitutionsForm.innerHTML = '';

	let i: number;
	for (i = 0; i < placeholders.length; i++) {
		substitutionsForm.innerHTML += `<label for="name">${placeholders[i]}:</label><br />
		<input class="form_element" type="text" id="placeholder${i}" name="placeholder${i}" placeholder="Text to replace ${placeholders[i]}" />
		<br />`;

		idList.push(`placeholder${i}`);
	}

	substitutionsForm.innerHTML += `<input type="submit" value="Generate Cover Letter">`;

	return idList;
}

// Find placeholders of format [placeholder]
function findPlaceholders(text: string): string[] {
	const phRegex: RegExp = new RegExp(/\[[^[]*\]/g);
	const placeholders: string[] = text.match(phRegex) || [];

	// remove duplicates
	let uniquePlaceholders: string[] = [];
	placeholders.forEach(ph => {
		if (!uniquePlaceholders.includes(ph)) {
			uniquePlaceholders.push(ph);
		}
	});

	return uniquePlaceholders;
}

// // Get replacements for each of the placeholders
// function getReplacements(placeholders: string[]): placeholderDictionary {
// 	let dict: placeholderDictionary = {};
// 	let i;
// 	for (i = 0; i < placeholders.length; i++) {
// 		dict[placeholders[i]] = i.toString();
// 	}

// 	return dict;
// }

function fillPlaceholders(text: string, dict: placeholderDictionary): string {
	let newText: string = text;

	Object.keys(dict).map(placeholder => {
		newText = newText.replaceAll(placeholder, dict[placeholder]);
	});

	console.log(newText);

	const page: HTMLElement | any = document.getElementById('page');
	page.innerHTML += `<div>${newText}</div>`;
	return newText;
}

// const text: string =
// 	"Hello, my name is [name] i'm applying for [job_position] at [company_name]. [job_position] is cool";

// console.log('wowo');
// const phList: string[] = findPlaceholders(text);
// console.log('findPlaceholders(text)', phList);

// const dict: placeholderDictionary = getReplacements(phList);
// console.log('getReplacements(phList)', dict);

// const newText: string = fillPlaceholders(text, dict);
// console.log('fillPlaceholders(text, dict)', newText);
