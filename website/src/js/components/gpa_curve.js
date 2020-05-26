"use strict";
import * as d3 from "d3";

import '../../styles/gpa_curve.scss';

export function gpaPlot(svgTag,data) {

    let dataset = [];
    let year = 2017;
    for (let each of data) {
        dataset.push({ year: year, y: each });
        year += 1;
    }

    // const margin = {top: 50, right: 50, bottom: 50, left: 50}
    //     , width = window.innerWidth - margin.left - margin.right // Use the window's width
    //     , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

    const margin = {top: 20, right: 20, bottom:20, left: 20}
        , width = 200 // Use the window's width
        , height = 140; // Use the window's height

    // The number of datapoints
    const n = dataset.length;

    // 5. X scale will use the index of our data
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, d => d.year))
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number
    const yScale = d3.scaleLinear()
        .domain([0, 6]) // input
        .range([height, 0]); // output

    // 7. d3's line generator
    const line = d3.line()
        .x(function(d) { return xScale(d.year); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX); // apply smoothing to the line

    // // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    //     var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() }; });

    console.log(dataset);

    // 1. Add the SVG to the page and employ #2
    const svg = d3.select(svgTag);
    svg.selectAll("*").remove();
    
    svg.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("*").remove();

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(2))
        .style("font-size", "7px"); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(8))
        .style("font-size", "7px");// Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataset) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator

    const makeYLines = () => d3.axisLeft().scale(yScale);

    svg.append("g")
        .attr("class", "grid")
        .call(makeYLines().tickSize(-width, 0, 0).tickFormat(""));

    // 12. Appends a circle for each datapoint
    svg.selectAll(".dot")
        .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.year); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", 3);

    svg
        .append("text")
        .style("font-size", "8px")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Average GPA Per Year");

    svg
        .append("text")
        .style("font-size", "5px")
        .attr("class", "label")
        .attr("x", -(height / 2))
        .attr("y", -18)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Grade");

    svg
        .append("text")
        .style("font-size", "6px")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height + 25)
        .attr("text-anchor", "middle")
        .text("Year");

}