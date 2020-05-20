"use strict";

import React, { useState } from "react";
import * as d3 from "d3";
import { CenterCircle } from "./center_circle";
import { Petal } from "./petal";

// TODO: move it from here
const COURSE_DESCRIPTIONS = require("../../processed_data/course_descriptions.json");

export function CircularPlot(props) {
  const [startAngle, setStartAngle] = useState(0);
  let arcGenerator = d3
    .arc()
    .innerRadius(props.circPlotRadius)
    .cornerRadius(2)
    .outerRadius(
      (d) => ((d.grade - 3) / 3) * props.petalsLength + props.circPlotRadius
    )
    .startAngle(0)
    .endAngle(
      (d) => - (2 * Math.PI * d.credits) / props.maxNumberCredits
    );
  const onPetalClick = (d) => {
    setStartAngle(
      ((d.creditsBefore + d.credits / 2) / props.maxNumberCredits) *
        2 *
        Math.PI -
        Math.PI / 2
    );
    const course = COURSE_DESCRIPTIONS[d.name.toLowerCase()];
  };

  // let data = [
  //   {
  //     grade: 6.0,
  //     credits: 6,
  //     creditsBefore: 0,
  //     block: "class_core",
  //     name: "Applied data analysis",
  //   },
  //   {
  //     grade: 6.0,
  //     credits: 6,
  //     creditsBefore: 6,
  //     block: "class_shs",
  //     name: "Machine learning",
  //   },
  // ];
  return (
    <svg id="plot" viewBox="-10 -10 220 220" width="100%" length="auto">
      <g id="circular_plot" transform="translate(90, 100) scale(1, 1)">
        <CenterCircle
          radius={props.circPlotRadius}
          gpa={props.gpa}
          totalCredits={props.totalCredits}
          maxNumberCredits={props.maxNumberCredits}
        />
        {props.data.map((d) => {
          return (
            <Petal
              key={d.name}
              data={d}
              i={0}
              arcGenerator={arcGenerator}
              petalsLength={props.petalsLength}
              circPlotRadius={props.circPlotRadius}
              maxNumberCredits={props.maxNumberCredits}
              startAngle={startAngle}
              onPetalClick={onPetalClick}
            />
          );
        })}
      </g>
    </svg>
  );
}
