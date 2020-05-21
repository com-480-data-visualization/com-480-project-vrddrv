"use strict";

import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import { Application } from "./components/application";
import { CircularPlot } from "./components/circular_plot";

import "../styles/index.scss";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const TRANSITION_TIME_SCALE = 600;

const CIRC_PLOT_RADIUS = 30;
const PETALS_LENGTH = 50;

ReactDOM.render(
  <Application
    canvasWidth={CANVAS_WIDTH}
    canvasHeight={CANVAS_HEIGHT}
    circPlotRadius={CIRC_PLOT_RADIUS}
    petalsLength={PETALS_LENGTH}
    transitionTimeScale={TRANSITION_TIME_SCALE}
  />,
  document.getElementById("root")
);
