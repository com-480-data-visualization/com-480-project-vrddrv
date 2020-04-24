"use strict";

import * as d3 from "d3";
import { CircularPlot } from "./circular_plot.js";
import { thresholdFreedmanDiaconis } from "d3";

class Header {
  constructor(name, context, posX, posY) {
    this.name = name;
    this.context = context;
    this.posX = posX;
    this.posY = posY;

    this.draw();
  }

  draw() {
    this.group = this.context
      .append("g")
      .attr("id", "header")
      .attr("transform", `translate(${this.posX}, ${this.posY})`);
    this.group.append("text").text(this.name);
  }
}

export class TranscriptScreen {
  constructor(
    transcript,
    context,
    canvasWidth,
    canvasHeight,
    transitionTimeScale
  ) {
    this.transcript = transcript;
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.transitionTimeScale = transitionTimeScale;

    this.initializePlot();
  }

  initializePlot() {
    this.clearWorkspace();

    this.screen = this.context.append("g");
    this.screen.attr("id", "transcript_screen");

    this.circularPlot = new CircularPlot(
      this.transcript,
      this.screen,
      this.canvasWidth,
      this.canvasHeight,
      0,
      20,
      this.transitionTimeScale
    );

    this.header = new Header(
      this.transcript.program.name,
      this.screen,
      this.canvasWidth / 2,
      10
    );
  }

  clearWorkspace() {
    this.context.select("*").remove();
  }
}
