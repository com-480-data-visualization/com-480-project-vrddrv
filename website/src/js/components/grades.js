"use strict";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { TranscriptScreen } from "../transcript_screen";

export function Grades(props) {
  const node = useRef();
  useEffect(() => {
    if (node.current) {
      new TranscriptScreen(
        props.transcript,
        d3.select(node.current),
        props.canvasWidth,
        props.canvasHeight,
        props.transitionTimeScale,
        props.setCourse
      );
    }
  }, [node]);

  return (
        <svg
          id="plot"
          viewBox="-10 -10 220 220"
          width="100%"
          length="auto"
          ref={node}
        ></svg>
  );
}
