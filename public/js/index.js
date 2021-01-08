"use strict";
var coverLetter = document.getElementById('cover_letter');
var nameElement = document.getElementById('name');
var info = document.getElementById('info');
var letterBody = document.getElementById('p1');
var signature = document.getElementById('sign');
var substitutionsForm = document.getElementById('substitutions');
var placeholdersList;
var substitutionsDict;
function isFormFilled() {
    return (nameElement.value != '' &&
        info.value != '' &&
        letterBody.value != '' &&
        signature.value != '');
}
// COVER LETTER SUBMIT
coverLetter.addEventListener('submit', function (event) {
    // prevent the default behavior of the submit button
    event.preventDefault();
    console.log('Cover Letter Text Submitted!');
    console.log('isFormFilled()', isFormFilled());
    if (!isFormFilled()) {
        return;
    }
    var text = nameElement.value + info.value + letterBody.value + signature.value;
    console.log('text', text);
    placeholdersList = findPlaceholders(text);
    console.log('findPlaceholders(text)', placeholdersList);
    generateSubstitutionsForm(placeholdersList);
});
// SUBSTITUTIONS SUBMIT
substitutionsForm.addEventListener('submit', function (event) {
    // prevent the default behavior of the submit button
    event.preventDefault();
    console.log('Substitutions form submitted!');
    console.log('isFormFilled()', isFormFilled());
    if (!isFormFilled()) {
        return;
    }
    var text = nameElement.value + info.value + letterBody.value + signature.value;
    console.log('text', text);
    placeholdersList = findPlaceholders(text);
    console.log('findPlaceholders(text)', placeholdersList);
    generateSubstitutionsForm(placeholdersList);
});
function generateSubstitutionsForm(placeholders) {
    if (placeholders.length <= 0) {
        substitutionsForm.innerHTML = "<div>No substitutions</div>";
        return false;
    }
    substitutionsForm.innerHTML = '';
    var i;
    for (i = 0; i < placeholders.length; i++) {
        substitutionsForm.innerHTML += "<label for=\"name\">" + placeholders[i] + ":</label><br />\n\t\t<input class=\"form_element\" type=\"text\" id=\"placeholder" + i + "\" name=\"placeholder" + i + "\" placeholder=\"Text to replace " + placeholders[i] + "\" />\n\t\t<br />";
    }
    substitutionsForm.innerHTML += "<input type=\"submit\" value=\"Generate Cover Letter\">";
    return true;
}
// Find placeholders of format [placeholder]
function findPlaceholders(text) {
    var phRegex = new RegExp(/\[[^[]*\]/g);
    var placeholders = text.match(phRegex) || [];
    return placeholders;
}
// Get replacements for each of the placeholders
function getReplacements(placeholders) {
    var dict = {};
    var i;
    for (i = 0; i < placeholders.length; i++) {
        dict[placeholders[i]] = i.toString();
    }
    return dict;
}
function fillPlaceholders(text, dict) {
    var newText = text;
    Object.keys(dict).map(function (placeholder) {
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
