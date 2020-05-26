"use strict";

import React from "react";
import { useSpring, animated } from "react-spring";
import { shortenCourseName } from "../helpers";

export function Petal(props) {
  const startAnimatedProps = useSpring({
    creditsBefore: props.data.creditsBefore,
    from: {
      creditsBefore: 0,
    },
    config: {
      duration: props.data.block.endsWith("suggestion")
        ? 0
        : props.transitionTimeScale,
    },
  });
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
        arcGenerator={props.arcGenerator}
        onPetalClick={props.onPetalClick}
        creditsBefore={startAnimatedProps.creditsBefore}
        scale={
          props.course && props.course.courseName === props.data.name
            ? 1.2
            : animatedProps.scale
        }
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
        (-360 * props.creditsBefore) / props.maxNumberCredits
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
