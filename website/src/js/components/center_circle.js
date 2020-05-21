"use strict";

import React from "react";
import { format } from "d3";

export function CenterCircle(props) {
  return (
    <g id="circular_plot_core">
      <circle r={props.radius} />
      <text y={-props.radius / 2}>GPA</text>
      <text id="GPA">{format(".3s")(props.gpa)}</text>
      <text y={props.radius / 2}>
        Credits: {props.totalCredits} / {props.maxNumberCredits}
      </text>
    </g>
  );
}
