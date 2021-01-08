"use strict";
var coverLetter = document.getElementById('cover_letter');
var nameElement = document.getElementById('name');
var info = document.getElementById('info');
var letterBody = document.getElementById('letter_body');
var signature = document.getElementById('sign');
var substitutionsForm = document.getElementById('substitutions');
var coverLetterIDList = ['name', 'info', 'letter_body', 'sign'];
var substitutionsFormIDList;
var placeholdersList;
var substitutionsDict;
var letterText;
// COVER LETTER SUBMIT
coverLetter.addEventListener('submit', function (event) {
    // prevent the default behavior of the submit button
    event.preventDefault();
    console.log('Cover Letter Text Submitted!');
    var isFilled = isFormFilled(coverLetterIDList);
    console.log('isFormFilled(coverLetterIDList)', isFilled);
    if (!isFilled) {
        return;
    }
    var text = nameElement.value + info.value + letterBody.value + signature.value;
    letterText = text;
    console.log('text', text);
    placeholdersList = findPlaceholders(text);
    console.log('findPlaceholders(text)', placeholdersList);
    // save list of IDs for substitutions form for later
    substitutionsFormIDList = generateSubstitutionsForm(placeholdersList);
    console.log('generateSubstitutionsForm(placeholdersList)', substitutionsFormIDList);
});
// SUBSTITUTIONS SUBMIT
substitutionsForm.addEventListener('submit', function (event) {
    // prevent the default behavior of the submit button
    event.preventDefault();
    console.log('Substitutions form submitted!');
    var isFilled = isFormFilled(substitutionsFormIDList);
    console.log('isFormFilled(substitutionsFormIDList)', isFilled);
    if (!isFilled) {
        return;
    }
    var dict = {};
    for (var i = 0; i < placeholdersList.length; i++) {
        var formItem = document.getElementById(substitutionsFormIDList[i]);
        dict[placeholdersList[i]] = formItem.value;
    }
    substitutionsDict = dict;
    console.log('placeholderDict', dict);
    fillPlaceholders(letterText, substitutionsDict);
});
function isFormFilled(idList) {
    var isFilled = true;
    idList.forEach(function (id) {
        var formItem = document.getElementById(id);
        isFilled = isFilled && formItem.value != '';
    });
    return isFilled;
}
function generateSubstitutionsForm(placeholders) {
    if (placeholders.length <= 0) {
        substitutionsForm.innerHTML = "<div>No substitutions</div>";
        return [];
    }
    var idList = [];
    // clear out subs form to prevent clutter
    substitutionsForm.innerHTML = '';
    var i;
    for (i = 0; i < placeholders.length; i++) {
        substitutionsForm.innerHTML += "<label for=\"name\">" + placeholders[i] + ":</label><br />\n\t\t<input class=\"form_element\" type=\"text\" id=\"placeholder" + i + "\" name=\"placeholder" + i + "\" placeholder=\"Text to replace " + placeholders[i] + "\" />\n\t\t<br />";
        idList.push("placeholder" + i);
    }
    substitutionsForm.innerHTML += "<input type=\"submit\" value=\"Generate Cover Letter\">";
    return idList;
}
// Find placeholders of format [placeholder]
function findPlaceholders(text) {
    var phRegex = new RegExp(/\[[^[]*\]/g);
    var placeholders = text.match(phRegex) || [];
    // remove duplicates
    var uniquePlaceholders = [];
    placeholders.forEach(function (ph) {
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
function fillPlaceholders(text, dict) {
    var newText = text;
    Object.keys(dict).map(function (placeholder) {
        newText = newText.replaceAll(placeholder, dict[placeholder]);
    });
    console.log(newText);
    var page = document.getElementById('page');
    page.innerHTML += "<div>" + newText + "</div>";
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
