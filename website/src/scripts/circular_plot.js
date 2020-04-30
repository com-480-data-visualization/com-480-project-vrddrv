"use strict";

import * as d3 from "d3";

const CIRC_PLOT_RADIUS = 30;
const PETALS_LENGTH = 60;

// TODO: move it from here
const COURSE_DESCRIPTIONS = require("../processed_data/course_descriptions.json");

export class CircularPlot {
  constructor(
    transcript,
    context,
    canvasWidth,
    canvasHeight,
    shiftX,
    shiftY,
    transitionTimeScale
  ) {
    this.transcript = transcript;
    this.context = context;
    this.data = transcript.classes;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.transitionTimeScale = transitionTimeScale;
    this.circPlotRadius = CIRC_PLOT_RADIUS;
    this.petalsLength = PETALS_LENGTH;
    this.maxNumberCredits = transcript.program.credits;
    // To make the plot more interesting
    // shuffleArray(this.data);
    this.startAngle = 0;
    this.centerX = canvasWidth / 2 + shiftX;
    this.centerY = canvasHeight / 2 + shiftY;
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

    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "petalTooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    let circPlot = this.context
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
    this.move(this.canvasWidth, -10);

    const course = COURSE_DESCRIPTIONS[d.name.toLowerCase()];
    document.getElementById("course_name").innerHTML = d.name;
    document.getElementById("profs_name").innerHTML = course["profName"];
    document.getElementById("course_desc").innerHTML = course["courseDesc"];
    // document.getElementById("course_prerequisites").innerHTML = course['profName'];
    document.getElementById("section_name").innerHTML = course["profName"];

    document.getElementById("blockContainer").style.display = "flex";
    document.getElementById("requirementsTable").style.display = "none";

    // ----------------------------------------------------------------------

    // const data = [ { "x": 10, "y": 15}, { "x": 13, "y": 20},
    //   { "x": 30, "y": 30}, { "x": 35, "y": 40},
    //   { "x": 40, "y": 20}, { "x": 80, "y": 70}];
    //
    // const lineGenerator = d3.line()
    //     .x(d => d.x)
    //     .y(d => d.y);
    //
    // const svgContainer = d3.select("div#plotting")
    //     .append("svg")
    //     .attr("width", 200)
    //     .attr("height", 200);
    //
    // const lineChart = svgContainer.append("path")
    //     .attr("d", lineGenerator(data))
    //     .attr("stroke", "blue")
    //     .attr("stroke-width", 2)
    //     .attr("fill", "none");

    // ----------------------------------------------------------------------

    let sample = [];
    let minGrade = 4;
    for (let each of course['grades_histogram']) {
      sample.push({grade:minGrade, value: each});
      minGrade+=0.25;
    }
    console.log(sample);

    // const sample = [
    //   {
    //     language: "Rust",
    //     value: 78.9,
    //     color: "#000000",
    //   },
    //   {
    //     language: "Kotlin",
    //     value: 75.1,
    //     color: "#00a2ee",
    //   },
    //   {
    //     language: "Python",
    //     value: 68.0,
    //     color: "#fbcb39",
    //   },
    //   {
    //     language: "TypeScript",
    //     value: 67.0,
    //     color: "#007bc8",
    //   },
    //   {
    //     language: "Go",
    //     value: 65.6,
    //     color: "#65cedb",
    //   },
    //   {
    //     language: "Swift",
    //     value: 65.1,
    //     color: "#ff6e52",
    //   },
    //   {
    //     language: "JavaScript",
    //     value: 61.9,
    //     color: "#f9de3f",
    //   },
    //   {
    //     language: "C#",
    //     value: 60.4,
    //     color: "#5d2f8e",
    //   },
    //   {
    //     language: "F#",
    //     value: 59.6,
    //     color: "#008fc9",
    //   },
    //   {
    //     language: "Clojure",
    //     value: 59.6,
    //     color: "#507dca",
    //   },
    // ];

    const svg = d3.select("svg");
    const svgContainer = d3.select("#container");

    const margin = 20;
    const width = 240 - 2 * margin;
    const height = 150 - 2 * margin;

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(sample.map((s) => s.grade))
      .padding(0.4);

    const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);

    const makeYLines = () => d3.axisLeft().scale(yScale);

    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style("font-size", "5px");

    chart.append("g").call(d3.axisLeft(yScale)).style("font-size", "5px");

    chart
      .append("g")
      .attr("class", "grid")
      .call(makeYLines().tickSize(-width, 0, 0).tickFormat(""));

    const barGroups = chart.selectAll().data(sample).enter().append("g");

    barGroups
      .append("rect")
      .attr("class", "bar")
      .attr("x", (g) => xScale(g.grade))
      .attr("y", (g) => yScale(g.value))
      .attr("height", (g) => height - yScale(g.value))
      .attr("width", xScale.bandwidth())
      .on("mouseenter", function (actual, i) {
        d3.selectAll(".value").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6);
          // .attr("x", (a) => xScale(a.grade) - 5)
          // .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.value);

        const line = chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        barGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", (a) => xScale(a.grade) + xScale.bandwidth() / 2)
          .attr("y", (a) => yScale(a.value) + 30)
          .attr("fill", "white")
          .attr("text-anchor", "middle")
          .text((a, idx) => {
            const divergence = (a.value - actual.value).toFixed(1);

            let text = "";
            if (divergence > 0) text += "+";
            text += `${divergence}%`;

            return idx !== i ? text : "";
          });
      })
      .on("mouseleave", function () {
        d3.selectAll(".value").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", (a) => xScale(a.grade))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    // barGroups
    //   .append("text")
    //   .attr("class", "value")
    //   .attr("x", (a) => xScale(a.grade) + xScale.bandwidth() / 2)
    //   .attr("y", (a) => yScale(a.value) + 30)
    //   .attr("text-anchor", "middle")
    //   .text((a) => `${a.value}%`);

    svg
      .append("text")
      .style("font-size", "5px")
      .attr("class", "label")
      .attr("x", -(height / 2) - margin)
      .attr("y", margin / 2.4 - 6)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Number of students");

    svg
      .append("text")
      .style("font-size", "5px")
      .attr("class", "label")
      .attr("x", width / 2 + margin)
      .attr("y", height + margin * 1.9)
      .attr("text-anchor", "middle")
      .text("Grades");

    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2 + margin)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text("Grade Distribution");

    // d3.select("iframe#course")
    //   .attr("left", "-1000px")
    //   .transition()
    //   .duration(this.transitionTimeScale)
    //   .attr("width", "100%")
    //   .attr("src", "https://edu.epfl.ch/coursebook/en/machine-learning-CS-433");
  }

  onPetalMouseOver(d, petal) {
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

      this.tooltip.selectAll("p").remove();
      this.tooltip.selectAll("h3").remove();
      const textLines = d.getTooltipText().split("\n");
      for (const idx in textLines)
        if (idx == 0) {
          this.tooltip.append("h3").text(textLines[idx]);
        } else {
          this.tooltip.append("p").text(textLines[idx]);
        }
      this.tooltip.style("visibility", "visible");
    } else {
      d3.select(petal).attr("opacity", "0.8");
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
      this.tooltip.style("visibility", "hidden");
    } else {
      d3.select(petal).attr("opacity", "1.0");
    }
  }

  setPetalCallbacks() {
    let _this = this;
    d3.selectAll(".petal")
      .on("click", function (d) {
        _this.onPetalClick(d);
      })
      .on("mouseover", function (d) {
        let petal = this;
        _this.onPetalMouseOver(d, petal);
      })
      .on("mouseout", function () {
        let petal = this;
        _this.onPetalMouseOut(petal);
      })
      .on("mousemove", function () {
        _this.tooltip
          .style("top", event.pageY + 15 + "px")
          .style("left", event.pageX + 15 + "px");
      });
  }

  move(x, y) {
    let _this = this;
    /*d3.select("svg#plot")
      .transition()
      .duration(_this.transitionTimeScale)
      .attr("transform", `translate(${x}, ${y})`);*/
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
