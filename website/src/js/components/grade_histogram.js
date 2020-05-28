"use strict";
import * as d3 from "d3";

import '../../styles/grade_histogram.scss';

export function gradeHistogram(svgTag, data, user_grade) {

    let sample = [];
    let minGrade = 4;
    for (let each of data) {
        sample.push({ grade: minGrade, value: each });
        minGrade += 0.25;
    }

    const svg = d3.select(svgTag);

    svg.selectAll("*").remove();

    const margin = 20;
    const width = 200 - 2 * margin;
    const height = 140 - 2 * margin;

    const chart = svg
        .append("g")
        .attr("transform", `translate(${margin}, ${margin})`);

    const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(sample.map((s) => s.grade))
        .padding(0.2);

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
        .attr("class", (g) => g.grade == user_grade ? "bar obtained" : "bar")
        .attr("x", (g) => xScale(g.grade))
        .attr("y", (g) => yScale(g.value))
        .attr("height", (g) => height - yScale(g.value))
        .attr("width", xScale.bandwidth())
        .on("mouseenter", function (actual, i) {
            d3.selectAll(".value").attr("opacity", 0);

            d3.select(this).transition().duration(300).attr("opacity", 0.6);
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

    // svg
    //     .append("text")
    //     .style("font-size", "5px")
    //     .attr("class", "label")
    //     .attr("x", -(height / 2) - margin)
    //     .attr("y", margin / 2.4 - 6)
    //     .attr("transform", "rotate(-90)")
    //     .attr("text-anchor", "middle")
    //     .text("Number of students");

    // svg
    //     .append("text")
    //     .style("font-size", "5px")
    //     .attr("class", "label")
    //     .attr("x", width / 2 + margin)
    //     .attr("y", height + margin * 1.9)
    //     .attr("text-anchor", "middle")
    //     .text("Grades");

    // d3.select("iframe#course")
    //   .attr("left", "-1000px")
    //   .transition()
    //   .duration(this.transitionTimeScale)
    //   .attr("width", "100%")
    //   .attr("src", "https://edu.epfl.ch/coursebook/en/machine-learning-CS-433");
}
