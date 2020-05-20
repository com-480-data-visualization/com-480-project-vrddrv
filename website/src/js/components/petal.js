"use strict";

import React from "react";

export function Petal(props) {
  console.log(props);
  console.log(
    -(
      (((props.data.grade - 3) / 3) * props.petalsLength) / 2 +
      props.circPlotRadius
    )
  );
  return (
    <g className={"petal " + props.data.block}>
      <path id={"block_" + props.i} d={props.arcGenerator(props.data)} />
      <text
        x={
          -(
            (((props.data.grade - 3) / 3) * props.petalsLength) / 2 +
            props.circPlotRadius
          )
        }
        transform={`rotate(${
          (props.startAngle * 180) / Math.PI +
          (90 - 360 * (props.data.credits / 2 - props.maxNumberCredits / 4)) /
            props.maxNumberCredits
        })`}
      >
        {shortenCourseName(props.data.name)}
      </text>
    </g>
  );
}

function shortenCourseName(name) {
  return name
    .split(" ")
    .map(function (d) {
      switch (d.toLowerCase()) {
        case "and":
          return "&";
        case "a":
          return "";
        case "of":
          return "";
        case "for":
          return "";
        case "in":
          return "";
        default:
          return d[0];
      }
    })
    .join("")
    .toUpperCase();
}
