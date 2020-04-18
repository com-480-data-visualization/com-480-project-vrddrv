"use strict";

import * as d3 from "d3";

export class CircularPlot {
  constructor(
    data,
    canvasWidth,
    canvasHeight,
    transitionTimeScale,
    circPlotRadius,
    petalsLength,
    maxNumberCredits
  ) {
    this.data = data;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.transitionTimeScale = transitionTimeScale;
    this.circPlotRadius = circPlotRadius;
    this.petalsLength = petalsLength;
    this.maxNumberCredits = maxNumberCredits;
    // To make the plot more interesting
    shuffleArray(this.data);

    this.draw();
  }

  draw() {
    let data = this.data;
    let canvasWidth = this.canvasWidth;
    let canvasHeight = this.canvasHeight;
    let transitionTimeScale = this.transitionTimeScale;
    let circPlotRadius = this.circPlotRadius;
    let petalsLength = this.petalsLength;
    let maxNumberCredits = this.maxNumberCredits;

    this.total_credits = 0; //data.reduce((v, t) => v + t.credits, 0);
    for (let idx = 0; idx < data.length; idx++) {
      data[idx].creditsBefore = this.total_credits;
      this.total_credits += data[idx].credits;
    }

    this.gpa =
      data.reduce((t, v) => t + v.credits * v.grade, 0) /
      this.total_credits;

    this.arcGenerator = d3
      .arc()
      .innerRadius(circPlotRadius)
      .cornerRadius(2)
      .outerRadius(
        (d) => ((d.grade - 3) / 3) * petalsLength + circPlotRadius
      )
      .startAngle(0)
      .endAngle((d) => -((2 * Math.PI * d.credits) / maxNumberCredits));

    // Delete Everything from the plot
    d3.select("svg#plot > *").remove();

    let circPlot = d3
      .select("svg#plot")
      .append("g")
      .attr("id", "circular_plot")
      .attr(
        "transform",
        `translate(${canvasWidth / 2}, ${canvasHeight / 2})`
      );

    let сircPlotcore = circPlot.append("g").attr("id", "circular_plot_core");

    сircPlotcore.append("circle").attr("r", circPlotRadius);

    сircPlotcore.append("text").attr("y", -15).text("GPA");

    сircPlotcore
      .append("text")
      .attr("id", "GPA")
      .transition()
      .duration(transitionTimeScale)
      .textTween(tweenNumbersTo(this.gpa));

    сircPlotcore
      .append("text")
      .attr("y", circPlotRadius / 2)
      .text(`Credits: ${this.total_credits} / ${maxNumberCredits}`);

    // Create Petals
    let petalsEnter = circPlot
      .selectAll(".petal")
      .data(data)
      .enter()
      .append("g")
      .attr("class", (d) => "petal " + d.block);

    petalsEnter
      .on("click", function (d) {
        alert("You clicked on " + d.name);
        // var queryString = "?para1=" + d.name + "&para2=" + d.grade;
        // window.location.href = "class_selection.html" + queryString;

        d3.select("circle")
          .transition()
          .duration(transitionTimeScale)
          .attr("cx", 120)
          .attr("cy", 60);
      })
      .on("mouseover", function (d) {
        d3.select(this)
          .attr("opacity", "0.8")
          .transition()
          .duration(transitionTimeScale / 20)
          .ease(d3.easeLinear)
          .attr(
            "transform",
            (d) =>
              `scale(1.2, 1.2) rotate(${
                (-360 * d.creditsBefore) / maxNumberCredits
              })`
          );
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("opacity", "1.0")
          .transition()
          .duration(transitionTimeScale / 20)
          .ease(d3.easeLinear)
          .attr(
            "transform",
            (d) => `rotate(${(-360 * d.creditsBefore) / maxNumberCredits})`
          );
      });

    petalsEnter
      .append("path")
      .attr("id", function (d, i) {
        return "block_" + i;
      })
      .attr("d", this.arcGenerator);

    // TODO: create a class or smth to compute all these shifts
    petalsEnter
      .append("text")
      .text((d) =>
        d.name
          .split(" ")
          .map((d) => (d == "and" ? "&" : d[0]))
          .join("")
          .toUpperCase()
      )
      .attr(
        "x",
        (d) =>
          -((((d.grade - 3) / 3) * petalsLength) / 2 + circPlotRadius)
      )
      .attr(
        "transform",
        (d) =>
          `rotate(${
            (90 - 360 * (d.credits / 2 - maxNumberCredits / 4)) /
            maxNumberCredits
          })`
      );

    // parseInt(d3.select(this).node().getBoundingClientRect().height)
    // parseInt(d3.select(this).node().getBoundingClientRect().width)

    // Open Animations
    petalsEnter
      .attr("transform", `rotate(0)`)
      .transition()
      .duration(transitionTimeScale)
      .attr(
        "transform",
        (d) => `rotate(${(-360 * d.creditsBefore) / maxNumberCredits})`
      );

    circPlot
      .attr(
        "transform",
        `matrix(0,0,0,0,${canvasWidth / 2},${canvasHeight / 2})`
      )
      .transition()
      .duration(0.8 * transitionTimeScale)
      .attr(
        "transform",
        `matrix(1,0,0,1,${canvasWidth / 2},${canvasHeight / 2})`
      );
  }
}

function tweenNumbersTo(to, from = 0.1, process = d3.format(".3s")) {
  return function (d) {
    const i = d3.interpolate(from, to);
    return function (t) {
      return process((this._current = i(t)));
    };
  };
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
