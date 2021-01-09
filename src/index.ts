const coverLetter: HTMLElement | any = document.getElementById('cover_letter');
const nameElement: HTMLElement | any = document.getElementById('name');
const info: HTMLElement | any = document.getElementById('info');
const letterBody: HTMLElement | any = document.getElementById('letter_body');
const signature: HTMLElement | any = document.getElementById('sign');
let substitutionsForm: HTMLElement | any = document.getElementById(
	'substitutions'
);

// \TODO try adding font swapping

interface placeholderDictionary {
	[placeholder: string]: string;
}

const coverLetterIDList: string[] = ['name', 'info', 'letter_body', 'sign'];
let coverLetterItems: string[] = [];
let substitutionsFormIDList: string[] = [];
let placeholdersList: string[] = [];

// COVER LETTER SUBMIT
coverLetter.addEventListener('submit', (event: Event) => {
	// prevent the default behavior of the submit button
	event.preventDefault();

	console.log('Cover Letter Text Submitted!');

	if (isFormEmpty(coverLetterIDList)) {
		return;
	}

	coverLetterItems = [];
	substitutionsFormIDList = [];
	placeholdersList = [];

	coverLetterItems.push('#' + nameElement.value);
	coverLetterItems.push(info.value + getDate());
	coverLetterItems.push(letterBody.value);
	coverLetterItems.push(signature.value);

	placeholdersList = findPlaceholders(coverLetterItems);
	// save list of IDs for substitutions form for later
	substitutionsFormIDList = generateSubstitutionsForm(placeholdersList);
});

// SUBSTITUTIONS SUBMIT
substitutionsForm.addEventListener('submit', (event: Event) => {
	// prevent the default behavior of the submit button
	event.preventDefault();

	console.log('Substitutions form submitted!');

	if (isFormEmpty(substitutionsFormIDList)) {
		return;
	}

	let dict: placeholderDictionary = {};
	for (let i = 0; i < placeholdersList.length; i++) {
		const formItem: HTMLElement | any = document.getElementById(
			substitutionsFormIDList[i]
		);
		dict[placeholdersList[i]] = formItem.value;
	}

	coverLetterItems = fillPlaceholders(coverLetterItems, dict);
});

// retrieve formatted date string Month dd, yyyy
function getDate(): string {
	const today: Date = new Date();
	const MONTHS: Record<string, string> = {
		'0': 'January',
		'1': 'February',
		'2': 'March',
		'3': 'April',
		'4': 'May',
		'5': 'June',
		'6': 'July',
		'7': 'August',
		'8': 'September',
		'9': 'October',
		'10': 'November',
		'11': 'December',
	};

	const month: string = MONTHS[String(today.getMonth())]; //January is 0!
	const dd = String(today.getDate()).padStart(2, '0');
	const yyyy = today.getFullYear();

	return month + ' ' + dd + ', ' + yyyy;
}

function isFormEmpty(idList: string[]): boolean {
	let isEmpty = false;
	idList.forEach(id => {
		const formItem: HTMLElement | any = document.getElementById(id);
		isEmpty = isEmpty && formItem.value == '';
	});

	return isEmpty;
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
function findPlaceholders(textItems: string[]): string[] {
	const phRegex: RegExp = new RegExp(/\[[^[]*\]/g);
	let placeholders: string[] = [];
	textItems.forEach(text => {
		const newList: string[] = text.match(phRegex) || [];
		placeholders = placeholders.concat(newList);
	});

	// remove duplicates
	let uniquePlaceholders: string[] = [];
	placeholders.forEach(ph => {
		if (!uniquePlaceholders.includes(ph)) {
			uniquePlaceholders.push(ph);
		}
	});

	return uniquePlaceholders;
}

function fillPlaceholders(
	textItems: string[],
	dict: placeholderDictionary
): string[] {
	let newTextItems: string[] = [];

	textItems.forEach(text => {
		let newText: string = text;
		Object.keys(dict).map(placeholder => {
			newText = newText.replaceAll(placeholder, dict[placeholder]);
		});

		newTextItems.push(newText);
	});

	const letter: HTMLElement | any = document.getElementById('letter');
	letter.innerHTML = '';

	const paragraphs: string[] = [];

	newTextItems.map(text => {
		paragraphs.concat(text.split(/\n\n/));
	});

	paragraphs.forEach(pText => {
		if (pText != '') {
			letter.innerHTML += `<p>${pText}</p>`;
		}
	});
	return newTextItems;
}
