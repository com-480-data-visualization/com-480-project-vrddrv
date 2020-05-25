"use strict";

import React, { useRef, useEffect } from "react";
import { CircularPlot } from "./circular_plot";

export function Grades(props) {
  return (
    <CircularPlot
      data={props.transcript.classes}
      circPlotRadius={props.circPlotRadius}
      petalsLength={props.petalsLength}
      canvasWidth={props.canvasWidth}
      canvasHeight={props.canvasHeight}
      transitionTimeScale={props.transitionTimeScale}
      maxNumberCredits={120}
      setCourse={props.setCourse}
      course={props.course}
      suggestions={props.suggestions}
    />
  );
}
