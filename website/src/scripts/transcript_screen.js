"use strict";

import * as d3 from "d3";
import { CircularPlot } from "./circular_plot.js";
import { showSkills } from "./skills";

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

class Requirement {
  constructor(name, status) {
    this.name = name;
    this.status = status;
  }
  draw(context, position) {
    this.group = context
      .append("g")
      .attr("class", "Requirement")
      .attr("transform", `translate(${position.x}, ${position.y})`);

    this.name = this.group
      .append("text")
      .text(this.name)
      .attr("x", "15")
      .attr("y", "3");
  }
}

class BinaryRequirement extends Requirement {
  constructor(name, status) {
    super(name, status);
  }
  draw(context, position) {
    super.draw(context, position);
    this.group.attr("class", "Requirement BinaryRequirement");

    this.checkbox = this.group
      .append("rect")
      .attr("width", "5")
      .attr("height", "5");
  }
}

class ContiniousRequirement extends Requirement {
  constructor(name, status, goal) {
    super(name, status);
    this.goal = goal;
  }
  draw(context, position) {
    super.draw(context, position);

    this.group.attr("class", "Requirement ContiniousRequirement");

    this.group
      .append("rect")
      .attr("width", "10")
      .attr("height", "5")
      .attr("fill", "grey");
    this.group
      .append("rect")
      .attr("width", 10 * (this.status / this.goal).toString())
      .attr("height", "5")
      .attr("fill", "green");
  }
}

class RequirementsTable {
  constructor(transcript, context, posX, posY) {
    this.transcript = transcript;
    this.context = context;
    this.posX = posX;
    this.posY = posY;

    this.getListOfRequirements();
    this.draw();
  }

  getListOfRequirements() {
    // TODO: create a list of all requirements for all programs
    this.requirements = [
      new ContiniousRequirement(
        "Total Credits",
        this.transcript.program.obtainedCredits,
        this.transcript.program.credits
      ),
      new ContiniousRequirement("6 credits in SHS", 3, 6),
      new ContiniousRequirement("Semester Project", 12, 12),
      new ContiniousRequirement("Internship", 0, 6),
      new ContiniousRequirement("Master thesis", 0, 6),
    ];
  }

  draw() {
    this.group = this.context
      .append("g")
      .attr("id", "requirementsTable")
      .attr("transform", `translate(${this.posX}, ${this.posY})`);
    this.group.append("text").text("Progress :").attr("class", "header");

    for (let idx = 0; idx < this.requirements.length; idx++) {
      this.requirements[idx].draw(this.group, { x: 0, y: 10 + 7 * idx });
    }
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
      -10,
      20,
      this.transitionTimeScale
    );

    this.header = new Header(
      this.transcript.program.name,
      this.screen,
      this.canvasWidth / 2,
      10
    );

    this.requirements = new RequirementsTable(
      this.transcript,
      this.screen,
      this.canvasWidth - 20,
      40
    );

    d3.select("button#skills_btn")
      .on("click", () => showSkills(this.circularPlot.data))
      .attr("style", "left: 0px; display: grid;");
    d3.select("button#credits_btn")
      .on("click", showCredits)
      .attr("style", "right: 0px; display: grid;");
  }

  clearWorkspace() {
    this.context.select("*").remove();
  }
}

function showCredits() {
  document.getElementById("plot").style.display="inline";
  document.getElementById("radar_chart").style.display="none";
  // d3.select("#course").attr("width", "0");
  // d3.select("#plot").attr("width", "100%");
  // d3.select(".radarChart").html("");
}
