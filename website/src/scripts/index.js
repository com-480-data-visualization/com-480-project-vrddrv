"use strict";

import * as d3 from "d3";
import { parseTranscriptFromPDF } from "./parsing.js";
import { DropZone } from "./dropzone.js";
import { CircularPlot } from "./circular_plot.js";
import { RadarChart } from "./radar_chart.js";

import "../styles/index.scss";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const TRANSITION_TIME_SCALE = 1000;

const CIRC_PLOT_RADIUS = 30;
const PETALS_LENGTH = 60;

function clearWorkspace() {
  d3.select("svg#plot > *").remove();
}

function dropHandler() {
  d3.event.preventDefault();

  var file = d3.event.dataTransfer.files[0];
  if (file) {
    d3.select("button#credits_btn")
      .on("click", showCredits);
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      parseTranscriptFromPDF(evt.target.result).then(function (transcript) {
        clearWorkspace();
        let circularPlot = new CircularPlot(
          transcript,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          TRANSITION_TIME_SCALE,
          CIRC_PLOT_RADIUS,
          PETALS_LENGTH
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

  d3.select("button#skills_btn")
    .on("click", showMockSkills);
});

function showMockSkills() {
  d3.select("#course").attr("width", "0");
  d3.select("#plot").attr("width", "0");

  var margin = { top: 50, right: 80, bottom: 50, left: 80 },
    width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

  //////////////////////////////////////////////////////////////
  ////////////////////////// Data //////////////////////////////
  //////////////////////////////////////////////////////////////

  var data = [
    {
      name: "All skills",
      axes: [
        { axis: "Data Science", value: 42 },
        { axis: "Computer Science", value: 30 },
        { axis: "Life Science", value: 20 },
        { axis: "Mechanical Engineering", value: 20 },
        { axis: "Cyber Security", value: 40 },
      ],
      color: "#26AF32",
    },
    {
      name: "Core skill",
      axes: [
        { axis: "Data Science", value: 50 },
        { axis: "Computer Science", value: 30 },
        { axis: "Life Science", value: 20 },
        { axis: "Mechanical Engineering", value: 10 },
        { axis: "Cyber Security", value: 35 },
      ],
      color: "#762712",
    },
  ];

  console.log(data[0].color);

  //////////////////////////////////////////////////////////////
  ////// First example /////////////////////////////////////////
  ///// (not so much options) //////////////////////////////////
  //////////////////////////////////////////////////////////////
  var radarChartOptions = {
    w: 290,
    h: 350,
    margin: margin,
    levels: 5,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
    format: ".0f",
  };

  // Draw the chart, get a reference the created svg element :
  let svg_radar1 = RadarChart(".radarChart", data, radarChartOptions);
}

function showCredits() {
  d3.select("#course").attr("width", "0");
  d3.select("#plot").attr("width", "100%");
  d3.select(".radarChart").html("");
}
