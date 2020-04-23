"use strict";

import * as d3 from "d3";

export class DropZone {
  constructor(canvasWidth, canvasHeight, dropHandler) {
    let dropZone = d3.select("svg#plot").append("g").attr("id", "drop_zone");

    dropZone
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", canvasWidth)
      .attr("height", canvasHeight);

    dropZone
      .append("text")
      .attr("x", canvasWidth / 2)
      .attr("y", canvasHeight / 2)
      .text("Drop your Transcript here");

    dropZone
      .on("drop", dropHandler)
      .on("dragover", () => {
        d3.event.preventDefault(); // Prevents file from being opened on drop
      })
      .on("mouseover", function (d, i) {
        d3.select(this).attr("opacity", "0.8");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("opacity", "1.0");
      });
  }
}
