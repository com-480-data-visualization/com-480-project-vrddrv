"use strict";

import * as d3 from "d3";
import { parseTranscriptFromPDF } from "./parsing.js";
import { DropZone } from "./dropzone.js";
import { TranscriptScreen } from "./transcript_screen.js";

import "../styles/index.scss";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const TRANSITION_TIME_SCALE = 1000;

function dropHandler() {
  d3.event.preventDefault();

  var file = d3.event.dataTransfer.files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      parseTranscriptFromPDF(evt.target.result).then(function (transcript) {
        new TranscriptScreen(
          transcript,
          d3.select("svg#plot"),
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          TRANSITION_TIME_SCALE
        );
      });
    };
    reader.onerror = function (evt) {
      console.error(evt);
    };
  }
}

function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    action();
  }
}

whenDocumentLoaded(() => {
  new DropZone(CANVAS_WIDTH, CANVAS_HEIGHT, dropHandler);
});
