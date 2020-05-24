"use strict";

import React from "react";
import { Grid, Typography, LinearProgress } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import { max } from "d3";

const BorderLinearProgress = withStyles({
  root: {
    height: 12,
    borderRadius: 20,
  },
})(LinearProgress);
const BorderLinearProgressCompleted = withStyles({
  root: {
    height: 12,
    borderRadius: 20,
  },
  bar: {
    backgroundColor: green[500],
  },
})(LinearProgress);

class Requirement {
  constructor(name, compute_val, min_val, max_val) {
    this.name = name;
    this.compute_val = compute_val;
    this.min_val = min_val;
    this.max_val = max_val;
  }

  render(classes) {
    const normilise = (val) =>
      (100 * (val - this.min_val)) / (this.max_val - this.min_val);

    this.classes = classes;

    this.progress = normilise(this.compute_val(classes));
    this.completed = this.progress >= 100;

    return (
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item xs={4}>
          {this.completed ? (
            <BorderLinearProgressCompleted variant="determinate" value={100} />
          ) : (
            <BorderLinearProgress variant="determinate" value={this.progress} />
          )}
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body2" gutterBottom>
            {" "}
            {this.name}{" "}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

function getProgramRequirementsList(program) {
  const totalCredits = new Requirement(
    "Total Credits",
    (classes) => classes.reduce((t, v) => t + v.credits, 0),
    0,
    120
  );

  // TODO: the problem here is that semester project and SHS has the same block
  const SHS = new Requirement(
    "6 Credits in SHS",
    (classes) =>
      classes.reduce((t, v) => {
        if (
          v.block != "class_shs" ||
          v.name == "Projet de semestre en data science"
        )
          return t;
        return t + v.credits;
      }, 0),
    0,
    6
  );

  const semesterProject = new Requirement(
    "Semester Project",
    (classes) =>
      classes.reduce((t, v) => {
        if (v.name != "Projet de semestre en data science") return t;
        return t + v.credits;
      }, 0),
    0,
    6
  );

  // TODO: currently we don't parse any information about Internship or Master Thesis
  const internship = new Requirement(
    "Internship",
    (classes) => 0,
    0,
    1
  );

  const masterThesis = new Requirement(
    "Master Thesis",
    (classes) => 0,
    0,
    30
  );

  switch (program.name) {
    case "Master SC_DS":
      return [totalCredits, SHS, semesterProject, internship, masterThesis];
  }

  // Default return;
  return [totalCredits, SHS, semesterProject, internship, masterThesis];
}

export function RequirementTable(props) {
  const RequirementList = getProgramRequirementsList(props.transcript.program);
  console.log(RequirementList);
  const renderedRequrements = RequirementList.map((req) => (
    <li key={req.name}>{req.render(props.transcript.classes)}</li>
  ));
  console.log(props.transcript);
  return (
    <Card
      style={{ top: "40px", left: "20px", width: "25%", position: "absolute", "max-width": "300px"}}
      id="requirementsTable"
    >
      <CardContent>
        <Typography gutterBottom variant="h6">
          {"Program Requirements"}
        </Typography>
        <ul>{renderedRequrements}</ul>
      </CardContent>
    </Card>
  );
}
