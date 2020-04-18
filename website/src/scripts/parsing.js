"use strict";

var pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js";

const VALID_BLOCK_NAMES = {
  "Group 1": "class_core",
  Options: "class_optional",
  'SHS"': "class_shs",
};
const VALID_SESSION_DATES = ["02.2020", "02.2019"];

export function extractDataFromPDF(pdfData) {
  // Load binary data from the obtained file
  var loadingTask = pdfjsLib.getDocument({ data: pdfData });
  return loadingTask.promise
    .then(function (pdfInstance) {
      console.log("PDF loaded");

      // TODO: Now we work only with the first page!
      return pdfInstance.getPage(1);
    })
    .then((pdfPage) => {
      return pdfPage.getTextContent();
    })
    .then(function (textContent) {
      // console.log(textContent.items);
      var parsedData = itemsPDFToDataInstance(textContent.items);

      console.log("Parsed data: ", parsedData);

      return parsedData;
    });
}

function itemsPDFToDataInstance(itemsArray) {
  let classesData = [];
  let currentBlock;

  for (let idx = 0; idx < itemsArray.length; idx++) {
    // Keep track of current block
    if (Object.keys(VALID_BLOCK_NAMES).includes(itemsArray[idx].str)) {
      currentBlock = VALID_BLOCK_NAMES[itemsArray[idx].str];
    }

    // Detect subject line by session date
    if (VALID_SESSION_DATES.includes(itemsArray[idx].str)) {
      let name = "",
        form = itemsArray[idx - 2].str;
      // TODO: now name is extracted in a very unrobust way:
      // 1. Check if it was attached to the form item
      let split = form.split(" ");
      if (split.length > 0) {
        name = split.slice(0, -1).join(" ");
        form = split[split.length - 1];
      }

      // 2. Take next left item while name has small letter first
      let nameIdx = idx - 1;
      while ((name === "" || name[0] == name[0].toLowerCase()) && nameIdx > 2) {
        name = itemsArray[nameIdx - 2].str + " " + name;
        nameIdx -= 1;
      }

      var subject = {
        name: name,
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

  return classesData;
}
