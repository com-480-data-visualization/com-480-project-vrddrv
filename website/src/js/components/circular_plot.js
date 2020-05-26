"use strict";

import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import * as d3 from "d3";
import { CenterCircle } from "./center_circle";
import { Petal } from "./petal";
import { Tooltip } from "./tooltip";
import { AnimatedSemesterDelimiter } from "./semester_delimiter";

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

  let data = props.data;
  function parseDate(d) {
    return new Date(...d.split(".").reverse());
  }
  data = data.sort((a, b) => (parseDate(a.sdate) < parseDate(b.sdate) ? -1 : 1));
  let semesters = [];
  let currentSemester = 1;
  let currentCredits = 0;
  let prevCredits = 0;
  let currentDate = data[0].sdate;
  data.forEach((d) => {
    if (d.sdate !== currentDate) {
      semesters.push([currentSemester, currentCredits, prevCredits]);
      currentDate = d.sdate;
      currentSemester += 1;
      prevCredits = currentCredits;
    }
    currentCredits += d.credits;
  });
  semesters.push([currentSemester, currentCredits, prevCredits]);

  let arcGenerator = d3
    .arc()
    .innerRadius(props.circPlotRadius)
    .cornerRadius(3)
    .outerRadius(
      (d) => ((d.grade - 3) / 3) * props.petalsLength + props.circPlotRadius
    )
    .startAngle(0)
    .endAngle((d) => -(2 * Math.PI * d.credits) / props.maxNumberCredits);

  let totalCredits = 0; //data.reduce((v, t) => v + t.credits, 0);
  for (let idx = 0; idx < data.length; idx++) {
    data[idx].creditsBefore = totalCredits;
    totalCredits += data[idx].credits;
  }

  let gpa = data.reduce((t, v) => t + v.credits * v.grade, 0) / totalCredits;

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
    console.log(d);
    setAnimatedProps({
      startAngle:
        ((d.creditsBefore + d.credits / 2) / props.maxNumberCredits) *
          2 *
          Math.PI -
        Math.PI / 2,
    });
    console.log(d.name.toLowerCase());
    const course = COURSE_DESCRIPTIONS[d.name.toLowerCase()];
    console.log(course);
    props.setCourse(course);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {tooltipData && <Tooltip pos={tooltipPos} data={tooltipData} />}
      <svg id="plot" viewBox="-10 -10 220 220">
        <animated.g id="circular_plot" transform={plot.transform}>
          {data.map((d) => {
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
          />
          {props.suggestions.map((d) => {
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
          <AnimatedSemesterDelimiter
            startAngle={animatedProps.startAngle}
            angle={0}
            prevAngle={0}
            length={(props.circPlotRadius + props.petalsLength) * 1.2}
          />
          {semesters.map(s => <AnimatedSemesterDelimiter
            key={s[0]}
            startAngle={animatedProps.startAngle}
            angle={s[1] / props.maxNumberCredits * 2 * Math.PI}
            prevAngle={s[2] / props.maxNumberCredits * 2 * Math.PI}
            length={(props.circPlotRadius + props.petalsLength) * 1.2}
            semester={s[0]}
          />)}
          <AnimatedCenterCircle
            radius={props.circPlotRadius}
            gpa={animatedProps.gpa}
            totalCredits={totalCredits}
            maxNumberCredits={props.maxNumberCredits}
          />
        </animated.g>
      </svg>
    </div>
  );
}
