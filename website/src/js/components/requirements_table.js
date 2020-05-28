"use strict";

import React from "react";
import { Grid, Typography, LinearProgress } from "@material-ui/core";
import { Card, CardContent, Tooltip } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import { useSpring, a } from "react-spring";
import { max } from "d3";
import { getProgramName, getSemesterProject } from "../helpers";

const BorderLinearProgress = withStyles({
  root: {
    height: 12,
    borderRadius: 20,
    backgroundColor: "#e8eaf6"
  },
  dashed: {
    visibility: "hidden",
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
  constructor(name, compute_val, min_val, max_val, tip) {
    this.name = name;
    this.compute_val = compute_val;
    this.min_val = min_val;
    this.max_val = max_val;
    this.tip = tip;
  }

  render(classes, suggestions) {
    const normalise = (val) =>
      (100 * (val - this.min_val)) / (this.max_val - this.min_val);

    this.classes = classes;

    this.value = this.compute_val(classes);
    this.progress = normalise(this.value);
    this.completed = this.progress >= 100;

    this.planned_value = this.compute_val(suggestions);
    this.planned_progress = normalise(this.planned_value);

    return (
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item xs={4}>
            <Tooltip
              title={
                `Progress : ${this.value} / ${this.max_val}` +
                (this.planned_progress > 0
                  ? `\nPlanned progress : ${this.value + this.planned_value} / ${
                      this.max_val
                    }`
                  : "")
              }
              placement="bottom"
            >
              {this.completed ? (
                <BorderLinearProgressCompleted
                  variant="determinate"
                  value={100}
                />
              ) : (
                <BorderLinearProgress
                  variant="buffer"
                  value={this.progress}
                  valueBuffer={this.planned_progress + this.progress}
                />
              )}
            </Tooltip>
          </Grid>
          <Grid item xs={8}>
            <Tooltip title={this.tip} placement="bottom">
              <Typography variant="body2" gutterBottom>
                {this.name}
              </Typography>
            </Tooltip>
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
    120,
    "You must obtain at least 120 credits for successfull completion of the program."
  );

  const coreCredits = new Requirement(
    "Core Credits",
    (classes) =>
      classes.reduce((t, v) => {
        return v.block.startsWith("class_core") ? t + v.credits : t;
      }, 0),
    0,
    30,
    "To succesfully finish your program you will need to get at least 30 credits in core section."
  );

  // TODO: the problem here is that semester project and SHS has the same block
  const SHS = new Requirement(
    "6 Credits in SHS",
    (classes) =>
      classes.reduce((t, v) => {
        if (
          !v.block.startsWith("class_shs") ||
          v.name.toLowerCase() === getSemesterProject(program.name)
        )
          return t;
        return t + v.credits;
      }, 0),
    0,
    6,
    "Through your studies you need to take one year-long SHS class and get 6 credits for it."
  );

  const semesterProject = new Requirement(
    "Semester Project",
    (classes) =>
      classes.reduce((t, v) => {
        if (v.name.toLowerCase() !== getSemesterProject(program.name)) return t;
        return t + v.credits;
      }, 0),
    0,
    12,
    "Semester Project is a mandatory part of the program and grant 12 credits."
  );

  // TODO: currently we don't parse any information about Internship or Master Thesis
  const internship = new Requirement(
    "Internship",
    (classes) => 0,
    0,
    1,
    "To get a diploma you will need to complete an industrial internship. \
     It may be done either duting 10 weeks in summer internship, \
     during 6 month instead one of the semesters or jointly with your Master Thesis."
  );

  const masterThesis = new Requirement(
    "Master Thesis",
    (classes) =>
      classes.reduce((t, v) => {
        if (v.name.toLowerCase() != `master project in ${getProgramName(program.name, " ")}`) return t;
        return t + v.credits;
      }, 0),
    0,
    30,
    "In the last semester of your program you will need to do a Master Thesis.\
     You may do it in one of the laboratories or in industry.\
     In the last case it may be joined with the mandatory Internship."
  );

  switch (program.name) {
    case "Master SC_DS":
      return [
        totalCredits,
        coreCredits,
        SHS,
        semesterProject,
        //internship,
        masterThesis,
      ];
      case "Master SC_CS":
        return [
          totalCredits,
          coreCredits,
          SHS,
          semesterProject,
          //internship,
          masterThesis,
        ];
  }

  // Default return;
  return [
    totalCredits,
    coreCredits,
    SHS,
    semesterProject,
    //internship,
    masterThesis,
  ];
}


const useStyles = makeStyles((theme) => ({
  root: {
    top: "200px",
    right: "20px",
    width: "100%",
    position: "absolute",
    background: "grey"
  }
}));

export function RequirementTable(props) {
  const classes = useStyles();
  const spring = useSpring({
    transform: props.course ? "translateX(110%)" : "translateX(0%)",
    from: {
      transform: "translateX(110%)",
    },
    config: {
      duration: props.transitionTimeScale,
    },
  });
  const RequirementList = getProgramRequirementsList(props.transcript.program);
  const renderedRequrements = RequirementList.map((req) => (
    <li key={req.name}>
      {req.render(props.transcript.classes, props.suggestions)}
    </li>
  ));

  return (
    <a.div className={classes.root} style={spring}>
      <Card
        style={{
          top: "0px",
          right: "0px",
          width: "100%",
          position: "absolute",
          maxWidth: "360px",
        }}
        id="requirementsTable"
      >
        <CardContent>
          <Typography gutterBottom variant="h6">
            {"Program Requirements"}
          </Typography>
          <ul>{renderedRequrements}</ul>
        </CardContent>
      </Card>
    </a.div>
  );
}
