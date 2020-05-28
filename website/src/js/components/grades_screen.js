"use strict";

import React, { useRef, useEffect, useState } from "react";
import { ClickAwayListener, Button, ButtonGroup } from "@material-ui/core";
import { Grades } from "./grades";
import { Course } from "./course";
import { CourseSelection } from "./course_selection";
import { RequirementTable } from "./requirements_table";
import { HintMainScreen, HintCourseScreen, HelpButton } from "./hints";
import { zip, getProgramName, getSemesterProject, knuthShuffle } from "../helpers";
import "../../styles/grade_screen.scss";

const COURSE_PROGRAMS = require("../../processed_data/course_programs.json");
const COURSE_DESCRIPTIONS = require("../../processed_data/course_descriptions.json");

export function GradesScreen(props) {
  const program = getProgramName(props.transcript.program.name, "_");
  const [course, setCourse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  let totalCredits = props.transcript.classes.reduce(
    (v, t) => v + t.credits,
    0
  );
  const maxNumberCredits = Math.max(
    totalCredits + suggestions.reduce((acc, cur) => acc + cur.credits, 0),
    120
  );
  const getCourseInfo = (courseName, creditsBefore) => {
    let course;
    if (typeof courseName === "string") {
      course = [courseName, COURSE_DESCRIPTIONS[courseName]];
    } else {
      course = courseName;
    }
    let block = "class_not_in_plan_suggestion";
    if (course[1].courseCode.startsWith("HUM-")) {
      block = "class_shs_suggestion";
    }
    COURSE_PROGRAMS[course[0]].forEach(([programName, type]) => {
      if (programName === program) {
        if (type === "core") {
          block = "class_core_suggestion";
        } else if (type === "opt") {
          block = "class_optional_suggestion";
        }
      }
    });
    if (course[0].toLowerCase().startsWith("master project")) {
      block = "class_thesis_suggestion";
    }
    return {
      name: course[1].courseName,
      block: block,
      credits: parseInt(course[1].courseCredit),
      creditsBefore: creditsBefore,
      grade: 6,
    };
  };

  const addCourse = (course) => {
    setSuggestions(
      suggestions.concat([
        getCourseInfo(
          course,
          totalCredits + suggestions.reduce((acc, cur) => acc + cur.credits, 0)
        ),
      ])
    );
  };

  const suggestCourses = (completed, suggestions) => {
    const programName = getProgramName(props.transcript.program.name, " ");
    const semesterProject = getSemesterProject(props.transcript.program.name);
    const allCourses = completed.concat(suggestions);
    let takenCourses = new Set(allCourses.map((c) => c.name.toLowerCase()));
    let coreCredits = allCourses.reduce((t, v) => {
      return v.block.startsWith("class_core") ? t + v.credits : t;
    }, 0);
    let shsName = null;
    const shsCredits = allCourses.reduce((t, v) => {
      if (
        !v.block.startsWith("class_shs") ||
        v.name.toLowerCase() === semesterProject
      )
        return t;
      shsName = v.name.toLowerCase().slice(0, -1);
      return t + v.credits;
    }, 0);
    const projectCredits = allCourses.reduce((t, v) => {
      if (v.name.toLowerCase() !== semesterProject) return t;
      return t + v.credits;
    }, 0);
    const thesisCredits = allCourses.reduce((t, v) => {
      if (v.name.toLowerCase() != `master project in ${programName}`) return t;
      return t + v.credits;
    }, 0);
    let suggestNames = [];
    let curCredits =
      totalCredits + suggestions.reduce((acc, cur) => acc + cur.credits, 0);
    let prevCredits = [];
    if (shsCredits === 0) {
      suggestNames.push("philosophy of life sciences i");
      prevCredits.push(curCredits);
      curCredits += 3;
      suggestNames.push("philosophy of life sciences ii");
      prevCredits.push(curCredits);
      curCredits += 3;
    } else if (shsCredits === 3) {
      suggestNames.push(shsName + "ii");
      prevCredits.push(curCredits);
      curCredits += 3;
    }
    if (projectCredits < 12) {
      suggestNames.push(semesterProject);
      prevCredits.push(curCredits);
      curCredits += 12;
    }
    const courseNames = knuthShuffle(Object.keys(COURSE_DESCRIPTIONS));
    for (const courseName of courseNames) {
      if (coreCredits >= 30) {
        break;
      }
      if (courseName.toLowerCase().startsWith("master project")) {
        continue;
      }
      if (!takenCourses.has(courseName)) {
        COURSE_PROGRAMS[courseName].forEach((programInfo) => {
          if (
            programInfo[0] === programName.replace(" ", "_") &&
            programInfo[1] === "core"
          ) {
            prevCredits.push(curCredits);
            suggestNames.push(courseName);
            takenCourses.add(courseName);
            const credits = parseInt(
              COURSE_DESCRIPTIONS[courseName].courseCredit
            );
            curCredits += credits;
            coreCredits += credits;
          }
        });
      }
    }
    
    for (const courseName of courseNames) {
      if (curCredits >= 90) {
        break;
      }
      if (courseName.toLowerCase().startsWith("master project")) {
        continue;
      }
      if (!takenCourses.has(courseName)) {
        COURSE_PROGRAMS[courseName].forEach((programInfo) => {
          if (programInfo[0] === programName.replace(" ", "_")) {
            prevCredits.push(curCredits);
            suggestNames.push(courseName);
            takenCourses.add(courseName);
            const credits = parseInt(
              COURSE_DESCRIPTIONS[courseName].courseCredit
            );
            curCredits += credits;
          }
        });
      }
    }
    if (thesisCredits < 30) {
      suggestNames.push(`master project in ${programName}`);
      prevCredits.push(curCredits);
      curCredits += 30;
    }
    const newSuggestions = zip([suggestNames, prevCredits]).map((x) =>
      getCourseInfo(x[0], x[1])
    );
    setSuggestions(suggestions.concat(newSuggestions));
  };

  return (
    <div>
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
          onClick={() => suggestCourses(props.transcript.classes, suggestions)}
        >
          Suggest courses
        </Button>
        <Button onClick={() => props.setActiveScreen("skills")}>
          Show skills
        </Button>
      </ButtonGroup>

      <Course
        transcript={props.transcript}
        course={course}
        transitionTimeScale={props.transitionTimeScale}
      />

      <HintMainScreen
        transitionTimeScale={props.transitionTimeScale}
        course={course}
        showHints={props.showHints}
        changeShowHints={props.changeShowHints}
      />

      <HintCourseScreen
        transitionTimeScale={props.transitionTimeScale}
        course={course}
        showHints={props.showHints}
        changeShowHints={props.changeShowHints}
      />

      <HelpButton
        showHints={props.showHints}
        changeShowHints={props.changeShowHints}
      />

      <div onClick={() => setCourse(null)}>
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
      </div>

      {suggestions.length > 0 && !course ? (
        <Button
          variant="contained"
          color="primary"
          style={{
            position: "absolute",
            left: "50%",
            top: "90%",
            transform: "translate(-50%, 0)",
          }}
          onClick={() => {
            props.setActiveScreen("transcript");
            setSuggestions([]);
            setCourse(null);
          }}
        >
          Reset
        </Button>
      ) : (
        <></>
      )}

      <CourseSelection
        addCourse={addCourse}
        program={program}
        completedCourses={props.transcript.classes}
        transitionTimeScale={props.transitionTimeScale}
        course={course}
      />

      <RequirementTable
        transcript={props.transcript}
        suggestions={suggestions}
        course={course}
        transitionTimeScale={props.transitionTimeScale}
      />
    </div>
  );
}
