"use strict";

import React, { useState } from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { Grades } from "./grades";
import { Course } from "./course";
import { CourseSelection } from "./course_selection";
import "../../styles/grade_screen.scss";

import { RequirementTable } from "./requirements_table";

export function GradesScreen(props) {
  const [course, setCourse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  let totalCredits = props.transcript.classes.reduce((v, t) => v + t.credits, 0);
  const addCourse = (course) => {
    setSuggestions(
      suggestions.concat([
        {
          name: course[0],
          block: "class_core_suggestion",
          credits: 5,
          creditsBefore:
            totalCredits +
            suggestions.reduce((acc, cur) => acc + cur.credits, 0),
          grade: 6,
        },
      ])
    );
  };
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
            setSuggestions([]);
            setCourse(null);
          }}
        >
          Reset
        </Button>
        <Button onClick={() => props.setActiveScreen("skills")}>
          Show skills
        </Button>
      </ButtonGroup>
      {course ? <></> : <RequirementTable transcript={props.transcript} />}
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
        suggestions={suggestions}
      />
      <CourseSelection addCourse={addCourse} />
    </>
  );
}
