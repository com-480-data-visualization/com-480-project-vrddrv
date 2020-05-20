"use strict";

import React from "react";

export function Petal(props) {
  return (
    <g
      className={"petal " + props.data.block}
      transform={`rotate(${
        (props.startAngle * 180) / Math.PI +
        (-360 * props.data.creditsBefore) / props.maxNumberCredits
      })`}
      onClick={() => {
        props.onPetalClick(props.data);
      }}
    >
      <path id={"block_" + props.i} d={props.arcGenerator(props.data)} />
      <text
        x={
          -(
            (((props.data.grade - 3) / 3) * props.petalsLength) / 2 +
            props.circPlotRadius
          )
        }
        transform={`rotate(${
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
