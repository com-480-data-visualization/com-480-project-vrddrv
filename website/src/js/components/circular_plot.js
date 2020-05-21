"use strict";

import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import * as d3 from "d3";
import { CenterCircle } from "./center_circle";
import { Petal } from "./petal";
import { Tooltip } from "./tooltip";

// TODO: move it from here
const COURSE_DESCRIPTIONS = require("../../processed_data/course_descriptions.json");

const AnimatedPetal = animated(Petal);
const AnimatedCenterCircle = animated(CenterCircle);

export function CircularPlot(props) {
  const centerX = props.canvasWidth / 2;
  const centerY = props.canvasHeight / 2;

  const [tooltipPos, setTooltipPos] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const plot = useSpring({
    transform: props.course
      ? `matrix(0.45, 0, 0, 0.45, ${centerX + 50}, ${centerY - 50})`
      : `matrix(0.45, 0, 0, 0.45, ${centerX}, ${centerY - 50})`,
    from: {
      transform: `matrix(0, 0, 0, 0, ${centerX}, ${centerY - 50})`,
    },
    config: {
      duration: props.transitionTimeScale,
    },
  });

  let arcGenerator = d3
    .arc()
    .innerRadius(props.circPlotRadius)
    .cornerRadius(2)
    .outerRadius(
      (d) => ((d.grade - 3) / 3) * props.petalsLength + props.circPlotRadius
    )
    .startAngle(0)
    .endAngle((d) => -(2 * Math.PI * d.credits) / props.maxNumberCredits);

  let totalCredits = 0; //data.reduce((v, t) => v + t.credits, 0);
  for (let idx = 0; idx < props.data.length; idx++) {
    props.data[idx].creditsBefore = totalCredits;
    totalCredits += props.data[idx].credits;
  }

  let gpa =
    props.data.reduce((t, v) => t + v.credits * v.grade, 0) / totalCredits;

  const [animatedProps, setAnimatedProps, _] = useSpring(() => ({
    startAngle: 0,
    gpa: gpa,
    scale: 1,
    config: { duration: props.transitionTimeScale },
    from: {
      startAngle: 0,
      gpa: 0,
      scale: 0,
    },
  }));

  const onPetalClick = (d) => {
    setAnimatedProps({
      startAngle:
        ((d.creditsBefore + d.credits / 2) / props.maxNumberCredits) *
          2 *
          Math.PI -
        Math.PI / 2,
    });
    const course = COURSE_DESCRIPTIONS[d.name.toLowerCase()];
    props.setCourse(course);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {tooltipData && <Tooltip pos={tooltipPos} data={tooltipData} />}
      <svg id="plot" viewBox="-10 -10 220 220">
        <animated.g id="circular_plot" transform={plot.transform}>
          <AnimatedCenterCircle
            radius={props.circPlotRadius}
            gpa={animatedProps.gpa}
            totalCredits={totalCredits}
            maxNumberCredits={props.maxNumberCredits}
          />
          {props.data.map((d) => {
            return (
              <AnimatedPetal
                key={d.name}
                data={d}
                arcGenerator={arcGenerator}
                petalsLength={props.petalsLength}
                circPlotRadius={props.circPlotRadius}
                maxNumberCredits={props.maxNumberCredits}
                transitionTimeScale={props.transitionTimeScale}
                startAngle={animatedProps.startAngle}
                onPetalClick={onPetalClick}
                setTooltipPos={setTooltipPos}
                setTooltipData={setTooltipData}
              />
            );
          })}
        </animated.g>
      </svg>
    </div>
  );
}
