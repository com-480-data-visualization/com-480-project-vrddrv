"use strict";

import * as d3 from "d3";
import { schemeSet3 } from "d3";

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
    this.startAngle = 0;
    this.centerX = canvasWidth / 2;
    this.centerY = canvasHeight / 2;
    this.mouseEventsEnabled = true;

    this.calcStats();
    this.initializePlot();
  }

  calcStats() {
    this.total_credits = 0; //data.reduce((v, t) => v + t.credits, 0);
    for (let idx = 0; idx < this.data.length; idx++) {
      this.data[idx].creditsBefore = this.total_credits;
      this.total_credits += this.data[idx].credits;
    }

    this.gpa =
      this.data.reduce((t, v) => t + v.credits * v.grade, 0) /
      this.total_credits;
  }

  initializePlot() {
    let _this = this;

    let arcGenerator = d3
      .arc()
      .innerRadius(_this.circPlotRadius)
      .cornerRadius(2)
      .outerRadius(
        (d) => ((d.grade - 3) / 3) * _this.petalsLength + _this.circPlotRadius
      )
      .startAngle(_this.startAngle)
      .endAngle(
        (d) =>
          _this.startAngle - (2 * Math.PI * d.credits) / _this.maxNumberCredits
      );

    // Delete Everything from the plot
    d3.select("svg#plot > *").remove();

    let circPlot = d3
      .select("svg#plot")
      .append("g")
      .attr("id", "circular_plot")
      .attr("transform", `translate(${_this.centerX}, ${_this.centerY})`);

    let сircPlotcore = circPlot.append("g").attr("id", "circular_plot_core");

    сircPlotcore.append("circle").attr("r", _this.circPlotRadius);

    сircPlotcore.append("text").attr("y", -15).text("GPA");

    сircPlotcore
      .append("text")
      .attr("id", "GPA")
      .transition()
      .duration(_this.transitionTimeScale)
      .textTween(tweenNumbersTo(_this.gpa));

    сircPlotcore
      .append("text")
      .attr("y", _this.circPlotRadius / 2)
      .text(`Credits: ${_this.total_credits} / ${_this.maxNumberCredits}`);

    // Create Petals
    let petalsEnter = circPlot
      .selectAll(".petal")
      .data(_this.data)
      .enter()
      .append("g")
      .attr("class", (d) => "petal " + d.block);

    this.setPetalCallbacks();

    petalsEnter
      .append("path")
      .attr("id", function (d, i) {
        return "block_" + i;
      })
      .attr("d", arcGenerator);

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
          -(
            (((d.grade - 3) / 3) * _this.petalsLength) / 2 +
            _this.circPlotRadius
          )
      )
      .attr(
        "transform",
        (d) =>
          `rotate(${
            (_this.startAngle * 180) / Math.PI +
            (90 - 360 * (d.credits / 2 - _this.maxNumberCredits / 4)) /
              _this.maxNumberCredits
          })`
      );

    // parseInt(d3.select(this).node().getBoundingClientRect().height)
    // parseInt(d3.select(this).node().getBoundingClientRect().width)

    // Open Animations
    petalsEnter
      .attr("transform", `rotate(0)`)
      .transition()
      .duration(_this.transitionTimeScale)
      .attr(
        "transform",
        (d) =>
          `rotate(${
            (_this.startAngle * 180) / Math.PI +
            (-360 * d.creditsBefore) / _this.maxNumberCredits
          })`
      );

    circPlot
      .attr("transform", `matrix(0,0,0,0,${_this.centerX},${_this.centerY})`)
      .transition()
      .duration(0.8 * _this.transitionTimeScale)
      .attr("transform", `matrix(1,0,0,1,${_this.centerX},${_this.centerY})`);
  }

  onPetalClick(d) {
    this.startAngle =
      ((d.creditsBefore + d.credits / 2) / this.maxNumberCredits) *
        2 *
        Math.PI -
      Math.PI / 2;
    this.move(2 * this.canvasWidth, -10);
  }

  onPetalMouseOver(petal) {
    console.log(this);
    if (this.mouseEventsEnabled) {
      d3.select(petal)
        .attr("opacity", "0.8")
        .transition()
        .duration(this.transitionTimeScale / 20)
        .ease(d3.easeLinear)
        .attr(
          "transform",
          (d) =>
            `scale(1.2, 1.2) rotate(${
              (this.startAngle * 180) / Math.PI +
              (-360 * d.creditsBefore) / this.maxNumberCredits
            })`
        );
    }
  }

  onPetalMouseOut(petal) {
    if (this.mouseEventsEnabled) {
      d3.select(petal)
        .attr("opacity", "1.0")
        .transition()
        .duration(this.transitionTimeScale / 20)
        .ease(d3.easeLinear)
        .attr(
          "transform",
          (d) =>
            `rotate(${
              (this.startAngle * 180) / Math.PI +
              (-360 * d.creditsBefore) / this.maxNumberCredits
            })`
        );
    }
  }

  setPetalCallbacks() {
    let _this = this;
    d3.selectAll(".petal")
      .on("click", function (d) {
        _this.onPetalClick(d);
      })
      .on("mouseover", function () {
        let petal = this;
        _this.onPetalMouseOver(petal);
      })
      .on("mouseout", function () {
        let petal = this;
        _this.onPetalMouseOut(petal);
      });
  }

  move(x, y) {
    let _this = this;
    d3.select("svg#plot")
      .transition()
      .duration(_this.transitionTimeScale)
      .attr("transform", `translate(${x}, ${y})`);
    d3.selectAll(".petal")
      .transition()
      .duration(_this.transitionTimeScale)
      .attr(
        "transform",
        (d) =>
          `rotate(${
            (_this.startAngle * 180) / Math.PI +
            (-360 * d.creditsBefore) / _this.maxNumberCredits
          })`
      )
      .on("start", function () {
        _this.mouseEventsEnabled = false;
      })
      .on("end", function () {
        _this.mouseEventsEnabled = true;
      });
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
