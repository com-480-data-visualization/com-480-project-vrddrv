"use strict";

import React from "react";
import { useSpring, animated } from "react-spring";

export function Petal(props) {
  const [animatedProps, setAnimatedProps, _] = useSpring(() => ({
    scale: 1.0,
    opacity: 1.0,
    config: { duration: props.transitionTimeScale / 20 },
  }));

  return (
    <g>
      <AnimatedInnerPetal
        data={props.data}
        startAngle={props.startAngle}
        maxNumberCredits={props.maxNumberCredits}
        circPlotRadius={props.circPlotRadius}
        petalsLength={props.petalsLength}
        opacity={animatedProps.opacity}
        scale={animatedProps.scale}
        arcGenerator={props.arcGenerator}
        onPetalClick={props.onPetalClick}
      />
      <g
        transform={`rotate(${
          (props.startAngle * 180) / Math.PI +
          (-360 * props.data.creditsBefore) / props.maxNumberCredits
        })`}
        onClick={() => {
          props.onPetalClick(props.data);
        }}
        onMouseOver={() => {
          console.log("Kek");
          setAnimatedProps({ scale: 1.2, opacity: 0.8 });
        }}
        onMouseOut={() => {
          setAnimatedProps({ scale: 1.0, opacity: 1.0 });
          props.setTooltipData(null);
        }}
        onMouseMove={(event) => {
          props.setTooltipPos([
            event.pageY + 15 + "px",
            event.pageX + 15 + "px",
          ]);
          props.setTooltipData(props.data);
        }}
        opacity={0}
      >
        <path d={props.arcGenerator(props.data)} />
      </g>
    </g>
  );
}

function InnerPetal(props) {
  return (
    <g
      className={"petal " + props.data.block}
      transform={`scale(${props.scale}, ${props.scale}) rotate(${
        (props.startAngle * 180) / Math.PI +
        (-360 * props.data.creditsBefore) / props.maxNumberCredits
      })`}
      opacity={props.opacity}
    >
      <path d={props.arcGenerator(props.data)} />
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

const AnimatedInnerPetal = animated(InnerPetal);

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
