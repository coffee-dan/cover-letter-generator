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
// COVER LETTER SUBMIT
coverLetter.addEventListener('submit', function (event) {
    // prevent the default behavior of the submit button
    event.preventDefault();
    console.log('Cover Letter Text Submitted!');
    if (isFormEmpty(coverLetterIDList)) {
        return;
    }
    coverLetterItems = [];
    substitutionsFormIDList = [];
    placeholdersList = [];
    coverLetterItems.push('# ' + nameElement.value);
    coverLetterItems.push(info.value + '\n\n' + getDate() + '\n');
    coverLetterItems.push(letterBody.value + '\n');
    coverLetterItems.push(signature.value);
    placeholdersList = findPlaceholders(coverLetterItems);
    // save list of IDs for substitutions form for later
    substitutionsFormIDList = generateSubstitutionsForm(placeholdersList);
});
// SUBSTITUTIONS SUBMIT
substitutionsForm.addEventListener('submit', function (event) {
    // prevent the default behavior of the submit button
    event.preventDefault();
    console.log('Substitutions form submitted!');
    if (isFormEmpty(substitutionsFormIDList)) {
        return;
    }
    var dict = {};
    for (var i = 0; i < placeholdersList.length; i++) {
        var formItem = document.getElementById(substitutionsFormIDList[i]);
        dict[placeholdersList[i]] = formItem.value;
    }
    coverLetterItems = fillPlaceholders(coverLetterItems, dict);
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
// check if form is empty
function isFormEmpty(idList) {
    var isEmpty = false;
    idList.forEach(function (id) {
        var formItem = document.getElementById(id);
        isEmpty = isEmpty && formItem.value == '';
    });
    return isEmpty;
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
    var placeholders = [];
    textItems.forEach(function (text) {
        var newList = text.match(phRegex) || [];
        placeholders = placeholders.concat(newList);
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
    console.log('filling placeholders...');
    var newTextItems = [];
    textItems.forEach(function (text) {
        var newText = text;
        Object.keys(dict).map(function (placeholder) {
            newText = newText.replaceAll(placeholder, dict[placeholder]);
        });
        newTextItems.push(newText);
    });
    var letter = document.getElementById('letter');
    letter.innerHTML = '';
    var paragraphs = [];
    newTextItems.map(function (text) {
        paragraphs = paragraphs.concat(text.split(/\n\n/));
    });
    paragraphs.forEach(function (pText) {
        pText = pText.replace('\n', '<br>');
        if (pText.match(/# .*/)) {
            pText = pText.substring(2);
            letter.innerHTML += "<h1>" + pText + "</h1>";
        }
        else if (pText != '') {
            letter.innerHTML += "<p>" + pText + "</p>";
        }
    });
    console.log('paragraphs', paragraphs);
    return newTextItems;
}
function downloadAsTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
var dwnBtn = document.getElementById('download-button');
dwnBtn.addEventListener('click', function () {
    var text = '';
    coverLetterItems.forEach(function (item) {
        text += item + '\n';
    });
    var filename = 'output.txt';
    downloadAsTextFile(filename, text);
}, false);
