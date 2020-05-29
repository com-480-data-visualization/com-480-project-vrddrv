"use strict";
import * as d3 from "d3";

import "../../styles/gpa_curve.scss";

export function gpaPlot(svgTag, data) {
  let dataset = [];
  let year = 2017;
  for (let each of data) {
    dataset.push({ year: year, y: each });
    year += 1;
  }

  const margin = 21;
  const width = 200 - 2 * margin;
  const height = 140 - 2 * margin;

  // 5. X scale will use the index of our data
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, (d) => d.year))
    .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  const yScale = d3
    .scaleLinear()
    .domain([3, 6]) // input
    .range([height, 0]); // output

  // 7. d3's line generator
  const line = d3
    .line()
    .x(function (d) {
      return xScale(d.year);
    }) // set the x values for the line generator
    .y(function (d) {
      return yScale(d.y);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

  // 1. Add the SVG to the page and employ #2
  const svg_selector = d3.select(svgTag);
  svg_selector.selectAll("*").remove();

  const svg = svg_selector
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  svg.selectAll("*").remove();

  // 3. Call the x axis in a group tag
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(2).tickFormat(d3.format("d")))
    .style("font-size", "5px"); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale).ticks(8))
    .style("font-size", "5px"); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg
    .append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

  const makeYLines = () => d3.axisLeft().scale(yScale);

  svg
    .append("g")
    .attr("class", "grid")
    .call(makeYLines().tickSize(-width, 0, 0).tickFormat(""));

  // 12. Appends a circle for each datapoint
  svg
    .selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function (d) {
      return xScale(d.year);
    })
    .attr("cy", function (d) {
      return yScale(d.y);
    })
    .attr("r", 4)
    .on("mouseenter", function (actual, i) {
      d3.select(this).transition().duration(300).attr("opacity", 0.6);
      const y = yScale(actual.y);

      const line = svg
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);
  
  })
  .on("mouseleave", function () {
      d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1);
      svg.selectAll("#limit").remove();
  });

  svg
    .append("text")
    .style("font-size", "5px")
    .attr("class", "label")
    .attr("x", 0 - (height / 2) - 1)
    .attr("y", -19)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Grade");

  svg
    .append("text")
    .style("font-size", "5.5px")
    .attr("class", "label")
    .attr("x", width/2)
    .attr("y", height/2 + 67)
    .attr("text-anchor", "middle")
    .text("Year");
}
