"use strict";

import React from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

const COURSE_DESCRIPTIONS = require("../../processed_data/course_descriptions.json");
const courses = Object.entries(COURSE_DESCRIPTIONS);

const useStyles = makeStyles((theme) => ({
  root: {
    top: "40px",
    right: "20px",
    width: "25%",
    position: "absolute",
    background: "white",
    margin: "100",
  },
  // textField: {
  //   "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "green",
  //   },
  //   "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "red",
  //   },
  //   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "purple",
  //   },
  // },
  // text: {
  //   color: "white"
  // }
}));

export function CourseSelection({ addCourse }) {
  const classes = useStyles();
  return (
    <Autocomplete
      id="course_selection"
      onChange={(event, course) => {
        addCourse(course);
      }}
      className={classes.root}
      options={courses}
      getOptionLabel={(d) => d[0]}
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

const mockOptions = [{ name: "Kek" }, { name: "Lol" }, { name: "KekLol" }];
