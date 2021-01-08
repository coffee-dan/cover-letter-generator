const coverLetter: HTMLElement | any = document.getElementById('cover_letter');
const nameElement: HTMLElement | any = document.getElementById('name');
const info: HTMLElement | any = document.getElementById('info');
const letterBody: HTMLElement | any = document.getElementById('p1');
const signature: HTMLElement | any = document.getElementById('sign');
let substitutionsForm: HTMLElement | any = document.getElementById(
	'substitutions'
);

interface placeholderDictionary {
	[placeholder: string]: string;
}

let placeholdersList: string[];
let substitutionsDict: placeholderDictionary;

function isFormFilled(): boolean {
	return (
		nameElement.value != '' &&
		info.value != '' &&
		letterBody.value != '' &&
		signature.value != ''
	);
}

// COVER LETTER SUBMIT
coverLetter.addEventListener('submit', (event: Event) => {
	// prevent the default behavior of the submit button
	event.preventDefault();

	console.log('Cover Letter Text Submitted!');
	console.log('isFormFilled()', isFormFilled());

	if (!isFormFilled()) {
		return;
	}

	const text =
		nameElement.value + info.value + letterBody.value + signature.value;

	console.log('text', text);

	placeholdersList = findPlaceholders(text);
	console.log('findPlaceholders(text)', placeholdersList);
	generateSubstitutionsForm(placeholdersList);
});

// SUBSTITUTIONS SUBMIT
substitutionsForm.addEventListener('submit', (event: Event) => {
	// prevent the default behavior of the submit button
	event.preventDefault();

	console.log('Substitutions form submitted!');
	console.log('isFormFilled()', isFormFilled());

	if (!isFormFilled()) {
		return;
	}

	const text =
		nameElement.value + info.value + letterBody.value + signature.value;

	console.log('text', text);

	placeholdersList = findPlaceholders(text);
	console.log('findPlaceholders(text)', placeholdersList);
	generateSubstitutionsForm(placeholdersList);
});

function generateSubstitutionsForm(placeholders: string[]): boolean {
	if (placeholders.length <= 0) {
		substitutionsForm.innerHTML = `<div>No substitutions</div>`;
		return false;
	}

	substitutionsForm.innerHTML = '';

	let i: number;
	for (i = 0; i < placeholders.length; i++) {
		substitutionsForm.innerHTML += `<label for="name">${placeholders[i]}:</label><br />
		<input class="form_element" type="text" id="placeholder${i}" name="placeholder${i}" placeholder="Text to replace ${placeholders[i]}" />
		<br />`;
	}

	substitutionsForm.innerHTML += `<input type="submit" value="Generate Cover Letter">`;

	return true;
}

// Find placeholders of format [placeholder]
function findPlaceholders(text: string): string[] {
	const phRegex: RegExp = new RegExp(/\[[^[]*\]/g);
	const placeholders: string[] = text.match(phRegex) || [];
	return placeholders;
}

// Get replacements for each of the placeholders
function getReplacements(placeholders: string[]): placeholderDictionary {
	let dict: placeholderDictionary = {};
	let i;
	for (i = 0; i < placeholders.length; i++) {
		dict[placeholders[i]] = i.toString();
	}

	return dict;
}

function fillPlaceholders(text: string, dict: placeholderDictionary): string {
	let newText: string = text;

	Object.keys(dict).map(placeholder => {
		newText = newText.replaceAll(placeholder, dict[placeholder]);
	});

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
