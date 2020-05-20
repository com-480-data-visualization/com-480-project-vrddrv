"use strict";

import React, { useState } from "react";
import * as d3 from "d3";
import { CenterCircle } from "./center_circle";
import { Petal } from "./petal";

export function CircularPlot(props) {
  let arcGenerator = d3
    .arc()
    .innerRadius(props.circPlotRadius)
    .cornerRadius(2)
    .outerRadius(
      (d) => ((d.grade - 3) / 3) * props.petalsLength + props.circPlotRadius
    )
    .startAngle(props.startAngle)
    .endAngle(
      (d) =>
        props.startAngle - (2 * Math.PI * d.credits) / props.maxNumberCredits
    );
  let data = {
    grade: 6.0,
    credits: 6,
    block: "class_core",
    name: "Applied data analysis",
  };
  return (
    <svg id="plot" viewBox="-10 -10 220 220" width="100%" length="auto">
      <g id="circular_plot" transform="translate(90, 100) scale(1, 1)">
        <CenterCircle
          radius={props.circPlotRadius}
          gpa={props.gpa}
          totalCredits={props.totalCredits}
          maxNumberCredits={props.maxNumberCredits}
        />
        <Petal
          data={data}
          i={0}
          arcGenerator={arcGenerator}
          petalsLength={props.petalsLength}
          circPlotRadius={props.circPlotRadius}
          maxNumberCredits={props.maxNumberCredits}
          startAngle={props.startAngle}
        />
      </g>
    </svg>
  );
}
