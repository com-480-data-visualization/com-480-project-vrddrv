"use strict";

import React, { useState } from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { Grades } from "./grades";
import { Course } from "./course";
import '../../styles/grade_screen.scss';

export function GradesScreen(props) {
  const [course, setCourse] = useState(null);
  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      >
        <Button
          onClick={() => {
            props.setActiveScreen("transcript");
            setCourse(null);
          }}
        >
          Show credits
        </Button>
        <Button onClick={() => props.setActiveScreen("skills")}>
          Show skills
        </Button>
      </ButtonGroup>
      <Course course={course} transitionTimeScale={props.transitionTimeScale} />
      <Grades
        transcript={props.transcript}
        canvasWidth={props.canvasWidth}
        canvasHeight={props.canvasHeight}
        transitionTimeScale={props.transitionTimeScale}
        circPlotRadius={props.circPlotRadius}
        petalsLength={props.petalsLength}
        course={course}
        setCourse={setCourse}
      />
    </>
  );
}
