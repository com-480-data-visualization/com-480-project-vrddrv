"use strict";

import { Transcript } from "./transcript.js";

var pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js";

const VALID_BLOCK_NAMES = {
  "Group 1": "class_core",
  Options: "class_optional",
  'SHS"': "class_shs",
};
const VALID_SESSION_DATE = /^\d\d\.\d\d\d\d$/;
const NAME_TRANSFORM_COORDINATE = 120.47;

export function parseTranscriptFromPDF(pdfData) {
  // Load binary data from the obtained file
  var loadingTask = pdfjsLib.getDocument({ data: pdfData });
  return loadingTask.promise
    .then(function (pdfInstance) {
      // Read all pages content
      var maxPages = pdfInstance.numPages;
      console.log(`Processing ${maxPages} paged PDF`);

      var countPromises = [];
      for (var j = 1; j <= maxPages; j++) {
        var page = pdfInstance.getPage(j);
        countPromises.push(
          page.then(function (page) {
            return page.getTextContent().then((text) => text.items);
          })
        );
      }
      return Promise.all(countPromises);
    })
    .then(function (pageContents) {
      const textContent = pageContents.flat();
      return new Transcript(
        getClassesInfoFromTextContent(textContent),
        getProgramFromTextContent(textContent)
      );
    });
}

function getProgramFromTextContent(itemsArray) {
  // Looking for the first word 'credits' -> next word is program name

  let idx = 0;
  while (itemsArray[idx].str !== "credits" && idx < itemsArray.length) {
    idx++;
  }

  if (idx < itemsArray.length) {
    // TODO: make a system of alerts for the user in case if the transcript was not recognized!
  }

  return {
    name: itemsArray[idx + 1].str,
    credits: Number.parseInt(itemsArray[idx + 2].str),
    obtainedCredits: Number.parseInt(itemsArray[idx + 3].str),
  };
}

function getClassesInfoFromTextContent(itemsArray) {
  let classesData = [];
  let currentBlock;

  for (let idx = 0; idx < itemsArray.length; idx++) {
    // Keep track of current block
    if (Object.keys(VALID_BLOCK_NAMES).includes(itemsArray[idx].str)) {
      currentBlock = VALID_BLOCK_NAMES[itemsArray[idx].str];
    }

    // Detect subject line by session date (looking for exact match with any dat mm.yyyy)
    if (VALID_SESSION_DATE.test(itemsArray[idx].str)) {
      let name = "",
        form = itemsArray[idx - 2].str;

      // TODO: now name is extracted in a very unrobust way:
      // 1. Check if it was attached to the form item
      let split = form.split(" ");
      if (split.length > 0) {
        name = split.slice(0, -1).join(" ");
        form = split[split.length - 1];
      }

      // 2. Take next left item while the next field
      //  is in position 120.47 - magic coordinate of the names in transcript
      //  or is in LowerCase
      let nameIdx = idx - 3;
      while (
        (name === "" ||
          name[0] == name[0].toLowerCase() ||
          itemsArray[nameIdx].transform[4] == NAME_TRANSFORM_COORDINATE) &&
        nameIdx > 0
      ) {
        name = itemsArray[nameIdx].str + " " + name;
        nameIdx -= 1;
      }

      // 3. Sanitize the name - sometimes it may be repeted.
      let nameCenterIdx = name.length / 2;
      if (
        name.substring(0, nameCenterIdx).toLowerCase() ==
        name.substring(nameCenterIdx).toLowerCase()
      ) {
        name = name.substring(nameCenterIdx);
      }
      if (
        name == "pratiques artistiques i artistic practices ii"
      )
      {
        name = "artistic practices ii"
      }

      var subject = {
        name: name.trim(),
        form: form,
        lang: itemsArray[idx - 1].str,
        sdate: itemsArray[idx].str,
        grade: Number.parseFloat(itemsArray[idx + 1].str),
        creditsOf: Number.parseInt(itemsArray[idx + 2].str),
        credits: Number.parseInt(itemsArray[idx + 3].str),
        block: currentBlock,
      };

      classesData.push(subject);
    }
  }

  // TODO: Now we delete classes with no grade
  return classesData.filter((d) => d.grade);
}
