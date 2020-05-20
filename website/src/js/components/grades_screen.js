"use strict";

import React, { useState } from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { Grades } from "./grades";
import { Course } from "./course";

export function GradesScreen(props) {
  const [course, setCourse] = useState(null);

  let activeTag = (
    <Grid container alignItems="center">
      {course && (
        <Grid item xs={6}>
          <Course course={course}/>
        </Grid>
      )}
      <Grid item xs={course ? 6 : 12}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <ButtonGroup variant="contained" color="primary">
              <Button onClick={() => props.setActiveScreen("transcript")}>
                Show credits
              </Button>
              <Button onClick={() => props.setActiveScreen("skills")}>
                Show skills
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item style={{ width: "60%" }}>
            <Grades
              transcript={props.transcript}
              canvasWidth={props.canvasWidth}
              canvasHeight={props.canvasHeight}
              transitionTimeScale={props.transitionTimeScale}
              course={course}
              setCourse={setCourse}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
  return activeTag;
}
