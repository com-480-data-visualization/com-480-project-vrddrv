"use strict";

import React from "react";
import {animated} from "react-spring";

export function SemesterDelimiter({
  startAngle,
  angle,
  prevAngle,
  length,
  semester
}) {
  return (
    <line
      id="semester_delimiter"
      strokeDasharray="5, 5"
      x1={0}
      y1={0}
      x2={length * Math.sin(startAngle - angle)}
      y2={-length * Math.cos(startAngle - angle)}
    />
  );
}

export const AnimatedSemesterDelimiter = animated(SemesterDelimiter);