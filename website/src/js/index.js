"use strict";

import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import { Application } from "./components/application";

import "../styles/index.scss";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const TRANSITION_TIME_SCALE = 1000;

function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    action();
  }
}

ReactDOM.render(
  <Application
    canvasWidth={CANVAS_WIDTH}
    canvasHeight={CANVAS_HEIGHT}
    transitionTimeScale={TRANSITION_TIME_SCALE}
  />,
  document.getElementById("root")
);

whenDocumentLoaded(() => {
  d3.select("button#mock_btn").on("click", () => mockTranscript());
});
