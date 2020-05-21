"use strict";

import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Grid, Container } from "@material-ui/core";
import { DropZone } from "./dropzone";
import { GradesScreen } from "./grades_screen";
import { SkillsScreen } from "./skills_screen";
import { Transcript } from "../transcript";
import { parseTranscriptFromPDF } from "../parsing.js";

const MOCK_TRANSCRIPT = require("../../processed_data/mock_transcript.json");

export function Application(props) {
  const [activeScreen, setActiveScreen] = useState("dropzone");
  const [transcript, setTranscript] = useState(mockTranscript());

  let activeTag;
  switch (activeScreen) {
    case "dropzone":
      activeTag = (
        <DropZone
          callback={(event) => {
            dropHandler(event);
            setActiveScreen("transcript");
          }}
          showMockTranscript={(transcript) => {
            setTranscript(mockTranscript());
            setActiveScreen("transcript");
          }}
        />
      );
      break;
    case "transcript":
      activeTag = (
        <GradesScreen
          setActiveScreen={setActiveScreen}
          transcript={transcript}
          canvasWidth={props.canvasWidth}
          canvasHeight={props.canvasHeight}
          transitionTimeScale={props.transitionTimeScale}
          circPlotRadius={props.circPlotRadius}
          petalsLength={props.petalsLength}
        />
      );
      break;
    case "skills":
      activeTag = (
        <SkillsScreen
          setActiveScreen={setActiveScreen}
          transcript={transcript}
        />
      );
      break;
  }

  return activeTag;
}

function dropHandler(event) {
  var file = event.dataTransfer.files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      parseTranscriptFromPDF(evt.target.result).then(function (transcript) {
        whenDocumentLoaded(() => {
          new TranscriptScreen(
            transcript,
            d3.select("svg#plot"),
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            TRANSITION_TIME_SCALE
          );
        });
      });
    };
    reader.onerror = function (evt) {
      console.error(evt);
    };
  }
}

function mockTranscript() {
  let transcript = new Transcript(
    MOCK_TRANSCRIPT.classes,
    MOCK_TRANSCRIPT.program
  );
  return transcript;
}
