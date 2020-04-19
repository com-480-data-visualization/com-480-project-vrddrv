"use strict";

import * as d3 from "d3";
import { extractDataFromPDF } from "./parsing.js";
import { DropZone } from "./dropzone.js";
import { CircularPlot } from "./circular_plot.js";

import "../styles/index.scss";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const TRANSITION_TIME_SCALE = 1000;

const CIRC_PLOT_RADIUS = 30;
const PETALS_LENGTH = 60;

//TODO: 120 should be parsed
const MAX_NUMBER_CREDITS = 120;

function dropHandler(ev) {
  d3.event.preventDefault();

  if (
    d3.event.dataTransfer.items &&
    d3.event.dataTransfer.items[0].kind === "file"
  ) {
    var file = d3.event.dataTransfer.items[0].getAsFile();
    file
      .text()
      .then(extractDataFromPDF)
      .then((parsedData) => {
        let circularPlot = new CircularPlot(
          parsedData,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          TRANSITION_TIME_SCALE,
          CIRC_PLOT_RADIUS,
          PETALS_LENGTH,
          MAX_NUMBER_CREDITS
        );
      })
      .catch(function (reason) {
        // PDF loading error
        console.error(reason);
      });
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
