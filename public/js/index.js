"use strict";
var coverLetter = document.getElementById('cover_letter');
var nameElement = document.getElementById('name');
var info = document.getElementById('info');
var letterBody = document.getElementById('letter_body');
var signature = document.getElementById('sign');
var substitutionsForm = document.getElementById('substitutions');
var coverLetterIDList = ['name', 'info', 'letter_body', 'sign'];
var coverLetterItems = [];
var substitutionsFormIDList = [];
var placeholdersList = [];
var substitutionsDict = {};
var letterText = '';
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
    coverLetterItems = [];
    substitutionsFormIDList = [];
    placeholdersList = [];
    substitutionsDict = {};
    letterText = '';
    coverLetterItems.push('#' + nameElement.value);
    coverLetterItems.push(info.value + getDate());
    coverLetterItems.push(letterBody.value);
    coverLetterItems.push(signature.value);
    var text = '#' +
        nameElement.value +
        '\n\n' +
        info.value +
        '\n\n' +
        getDate() +
        '\n\n' +
        letterBody.value +
        '\n\n' +
        signature.value;
    letterText = text;
    console.log('text', text);
    placeholdersList = findPlaceholders(coverLetterItems);
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
    fillPlaceholders(coverLetterItems, substitutionsDict);
});
// retrieve formatted date string Month dd, yyyy
function getDate() {
    var today = new Date();
    var MONTHS = {
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
    var month = MONTHS[String(today.getMonth())]; //January is 0!
    var dd = String(today.getDate()).padStart(2, '0');
    var yyyy = today.getFullYear();
    return month + ' ' + dd + ', ' + yyyy;
}
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
function findPlaceholders(textItems) {
    var phRegex = new RegExp(/\[[^[]*\]/g);
    // const placeholders: string[] = text.match(phRegex) || [];
    var placeholders = [];
    textItems.forEach(function (text) {
        var newList = text.match(phRegex) || [];
        placeholders = placeholders.concat(newList);
        console.log('placeholders', newList, placeholders);
    });
    // remove duplicates
    var uniquePlaceholders = [];
    placeholders.forEach(function (ph) {
        if (!uniquePlaceholders.includes(ph)) {
            uniquePlaceholders.push(ph);
        }
    });
    return uniquePlaceholders;
}
function fillPlaceholders(textItems, dict) {
    var newTextItems = [];
    textItems.forEach(function (text) {
        var newText = text;
        Object.keys(dict).map(function (placeholder) {
            newText = newText.replaceAll(placeholder, dict[placeholder]);
        });
        newTextItems.push(newText);
    });
    console.log(newTextItems);
    var letter = document.getElementById('letter');
    letter.innerHTML = '';
    var paragraphs = [];
    newTextItems.map(function (text) {
        paragraphs.concat(text.split(/\n\n/));
    });
    console.log('paragraphs', paragraphs);
    console.log(paragraphs);
    paragraphs.forEach(function (pText) {
        if (pText != '') {
            letter.innerHTML += "<p>" + pText + "</p>";
        }
    });
    return newTextItems;
}
