"use strict";

import React, { useState, useEffect } from "react";
import { DropZone } from "./dropzone";
import { GradesScreen } from "./grades_screen";
import { SkillsScreen } from "./skills_screen";
import { Transcript } from "../transcript";
import { LoadingScreen } from "./loading_screen";
import { parseTranscriptFromPDF } from "../parsing.js";

const MOCK_TRANSCRIPT = require("../../processed_data/mock_transcript.json");

export function Application(props) {

  // useState is a Hook which returns a pair: the current state value and a function that lets you update it.
  const [activeScreen, setActiveScreen] = useState("dropzone");
  const [transcript, setTranscript] = useState(mockTranscript());

  function readTranscript(file) {
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        parseTranscriptFromPDF(evt.target.result).then((transcript) => {
          setTranscript(transcript);
          setActiveScreen("transcript");
        });
      };
      reader.onerror = function (evt) {
        console.error(evt);
      };
    }
  }

  let activeTag;
  switch (activeScreen) {
    case "dropzone":
      activeTag = (
        <DropZone
          callback={(file) => {
            setActiveScreen("loading");
            setTimeout(() => readTranscript(file), 1000);
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
          transitionTimeScale={props.transitionTimeScale}
        />
      );
      break;
    case "loading":
      activeTag = (
        <LoadingScreen/>
      );
      break;
  }

  return activeTag;
}

function mockTranscript() {
  let transcript = new Transcript(
    MOCK_TRANSCRIPT.classes,
    MOCK_TRANSCRIPT.program
  );
  return transcript;
}
