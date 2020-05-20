"use strict";

import React from "react";

export function CenterCircle(props) {
  return (
    <g id="circular_plot_core">
      <circle r={props.radius} />
      <text y={-props.radius / 2}>GPA</text>
      <text id="GPA">{props.gpa}</text>
      <text y={props.radius / 2}>
        Credits: {props.totalCredits} / {props.maxNumberCredits}
      </text>
    </g>
  );
}
