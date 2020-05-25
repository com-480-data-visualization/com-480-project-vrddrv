"use strict";

import React from "react";
import { format } from "d3";

export function CenterCircle(props) {
  return (
    <g id="circular_plot_core">
      {/* <defs>
        <filter id="drop-shadow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="5" dy="5" result="offsetblur" />
          <feFlood flood-color="#000000" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs> */}
      <circle r={props.radius} />
      <text y={-props.radius / 2}>GPA</text>
      <text id="GPA">{format(".3s")(props.gpa)}</text>
      <text y={props.radius / 2}>
        Credits: {props.totalCredits} / {props.maxNumberCredits}
      </text>
    </g>
  );
}
