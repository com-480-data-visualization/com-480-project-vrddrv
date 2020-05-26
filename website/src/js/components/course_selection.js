"use strict";

import React from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { getProgramName } from "../helpers";

var COURSE_DESCRIPTIONS = require("../../processed_data/course_descriptions.json");
const COURSE_PROGRAMS = require("../../processed_data/course_programs.json");

const useStyles = makeStyles((theme) => ({
  root: {
    top: "20px",
    right: "20px",
    width: "25%",
    position: "absolute",
    background: "white",
    padding: "7px",
    borderRadius: "5px",
  },
}));

export function CourseSelection({ addCourse, program, completedCourses }) {
  for (let course in COURSE_DESCRIPTIONS) {
    if (
      COURSE_DESCRIPTIONS[course].courseCode.startsWith("HUM-") ||
      course === `projet de semestre en ${getProgramName(program.name, " ")}`
    ) {
      COURSE_DESCRIPTIONS[course].type = "SHS";
    } else {
      COURSE_DESCRIPTIONS[course].type = "Not in program";
    }
    COURSE_PROGRAMS[course].forEach((element) => {
      if (element[0] == program) {
        if (element[1] == "core") {
          COURSE_DESCRIPTIONS[course].type = "Core";
        } else {
          COURSE_DESCRIPTIONS[course].type = "Optional";
        }
      }
    });
  }
  completedCourses.forEach((course) => {
    delete course.name.toLowerCase();
  });

  let courses = Object.entries(COURSE_DESCRIPTIONS);

  function getCourseLevel(type) {
    switch (type) {
      case "Core":
        return 3;
      case "Optional":
        return 2;
      case "SHS":
        return 1;
      default:
        return 0;
    }
  }
  courses = courses.sort((a, b) => getCourseLevel(a[1].type) > getCourseLevel(b[1].type) ? -1 : 1);
  const classes = useStyles();
  return (
    <Autocomplete
      id="course_selection"
      onChange={(event, course) => {
        addCourse(course);
      }}
      className={classes.root}
      options={courses}
      getOptionLabel={(d) => d[1].courseName}
      groupBy={(option) => option[1].type}
      renderInput={(params) => (
        <TextField
          {...params}
          // className={classes.textField}
          // InputProps={{
          //   className: classes.text
          // }}
          label="Add course to your plan"
          variant="outlined"
        />
      )}
    />
  );
}
