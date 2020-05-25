"use strict";

import React from "react";
import { format } from "d3";

export function CenterCircle(props) {
  return (
    <g id="circular_plot_core">
      <defs>
        <filter id="drop-shadow" x="-100%" y="-100%" width="300%" height="300%">
          <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      <circle r={props.radius} filter="url(#drop-shadow)" />
      <text y={-props.radius / 2}>GPA</text>
      <text id="GPA">{format(".3s")(props.gpa)}</text>
      <text y={props.radius / 2}>
        Credits: {props.totalCredits} / {props.maxNumberCredits}
      </text>
    </g>
  );
}
