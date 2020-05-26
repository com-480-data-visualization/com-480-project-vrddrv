"use strict";

import React, { useState } from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { Grades } from "./grades";
import { Course } from "./course";
import { CourseSelection } from "./course_selection";
import "../../styles/grade_screen.scss";

import { RequirementTable } from "./requirements_table";

const COURSE_PROGRAMS = require("../../processed_data/course_programs.json");
const program = "data_science";

export function GradesScreen(props) {
  const [course, setCourse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  let totalCredits = props.transcript.classes.reduce(
    (v, t) => v + t.credits,
    0
  );
  const maxNumberCredits = Math.max(
    totalCredits + suggestions.reduce((acc, cur) => acc + cur.credits, 0), 120
  );
  console.log(maxNumberCredits);
  const addCourse = (course) => {
    let block = "class_not_in_plan_suggestion";
    COURSE_PROGRAMS[course[0]].forEach(([programName, type]) => {
      if (programName === program) {
        if (type === "core") {
          block = "class_core_suggestion";
        } else if (type === "opt") {
          block = "class_optional_suggestion";
        }
      }
    });
    setSuggestions(
      suggestions.concat([
        {
          name: course[1].courseName,
          block: block,
          credits: parseInt(course[1].courseCredit),
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
      {course ? (
        <></>
      ) : (
        <RequirementTable
          transcript={props.transcript}
          suggestions={suggestions}
        />
      )}
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
        maxNumberCredits={maxNumberCredits}
      />
      <CourseSelection addCourse={addCourse} />
    </>
  );
}
