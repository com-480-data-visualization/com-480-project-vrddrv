"use strict";

import React from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { getProgramName } from "../helpers";
import { useSpring, a } from "react-spring";

const COURSE_DESCRIPTIONS = require("../../processed_data/course_descriptions.json");
const COURSE_PROGRAMS = require("../../processed_data/course_programs.json");

const useStyles = makeStyles((theme) => ({
  root: {
    top: "80px",
    right: "20px",
    width: "25%",
    position: "absolute",
    background: "white",
    padding: "7px",
    borderRadius: "5px",
  },
}));


export function CourseSelection({ addCourse, program, completedCourses, transitionTimeScale, course}) {

  const spring = useSpring({
    transform: course ? "translateX(110%)" : "translateX(0%)",
    from: {
      transform: "translateX(110%)",
    },
    config: {
      duration: transitionTimeScale,
    },
  });

  let courseDescriptions = clone(COURSE_DESCRIPTIONS);
  for (let course in courseDescriptions) {
    if (
      courseDescriptions[course].courseCode.startsWith("HUM-") ||
      course === `projet de semestre en ${getProgramName(program.name, " ")}`
    ) {
      courseDescriptions[course].type = "SHS";
    } else {
      courseDescriptions[course].type = "Not in program";
    }
    COURSE_PROGRAMS[course].forEach((element) => {
      if (element[0] == program) {
        if (element[1] == "core") {
          courseDescriptions[course].type = "Core";
        } else {
          courseDescriptions[course].type = "Optional";
        }
      }
    });
  }
  completedCourses.forEach((course) => {
    delete courseDescriptions[course.name.toLowerCase()];
  });

  let courses = Object.entries(courseDescriptions);

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
    <a.div className={classes.root} style={spring}>
      <Autocomplete
        id="course_selection"
        onChange={(event, course) => {
          addCourse(course);
        }}
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
    </a.div>
  );
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}