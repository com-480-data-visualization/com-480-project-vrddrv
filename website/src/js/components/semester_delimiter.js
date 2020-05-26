"use strict";

import React from "react";
import { animated } from "react-spring";

export function SemesterDelimiter({
  startAngle,
  angle,
  prevAngle,
  length,
  semester,
}) {
  const finalAngle = startAngle - angle;
  return (
    <g id="semester_delimiter">
      <line
        strokeDasharray="5, 5"
        x1={0}
        y1={0}
        x2={length * Math.sin(finalAngle)}
        y2={-length * Math.cos(finalAngle)}
      />
      {semester && (
        <g>
          <defs>
            <path
              id={`semesterPath${semester}`}
              d={describeArc(
                0,
                0,
                length,
                finalAngle,
                startAngle - prevAngle
              )}
            />
          </defs>
          <text textAnchor="middle">
              <textPath xlinkHref={`#semesterPath${semester}`} startOffset="50%">{semester} semester</textPath>
          </text>
        </g>
      )}
    </g>
  );
}

export const AnimatedSemesterDelimiter = animated(SemesterDelimiter);

function polarToCartesian(centerX, centerY, radius, angle) {
  return {
      x: centerX + (radius * Math.sin(angle)),
      y: centerY - (radius * Math.cos(angle))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, startAngle);
  var end = polarToCartesian(x, y, radius, endAngle);
  var arcLength = endAngle - startAngle;
  if (arcLength < 0) arcLength += 2 *Math.PI;
  var longArc = arcLength >= Math.PI ? 1 : 0;
  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, longArc, 1, end.x, end.y
  ].join(" ");
  return d;
}