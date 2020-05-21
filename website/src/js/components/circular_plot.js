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

export function CircularPlot(props) {
  const [tooltipPos, setTooltipPos] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

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
  let gpa = d3.format(".3s")(
    props.data.reduce((t, v) => t + v.credits * v.grade, 0) / totalCredits
  );

  const [animatedProps, setAnimatedProps, _] = useSpring(() => ({
    startAngle: 0,
    config: { duration: props.transitionTimeScale },
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
    <div>
      {tooltipData && <Tooltip pos={tooltipPos} data={tooltipData} />}
      <svg id="plot" viewBox="-10 -10 220 220" width="100%" length="auto">
        <g id="circular_plot" transform="translate(90, 100) scale(1, 1)">
          <CenterCircle
            radius={props.circPlotRadius}
            gpa={gpa}
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
        </g>
      </svg>
    </div>
  );
}
