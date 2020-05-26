import React, { useRef, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextCard } from "./text_card";
import { useSpring, a } from "react-spring";
import {gradeHistogram} from "./grade_histogram";
import {gpaPlot} from "./gpa_curve";

const useStyles = makeStyles((theme) => ({
  root: {
    top: "40px",
    left: "20px",
    width: "50%",
    position: "absolute",
  },
}));

export function Course({ course, transitionTimeScale }) {
  const classes = useStyles();
  const spring = useSpring({
    transform: course ? "translateX(0%)" : "translateX(-110%)",
    config: {
      duration: transitionTimeScale,
    },
  });

  const plot = useRef();
  useEffect(() => {
    if (plot.current && course) {
      gradeHistogram(plot.current, course.grades_histogram);
    }
  }, [plot, course]);


  const gpa_plot = useRef();
  useEffect(() => {
    if (gpa_plot.current && course) {
      gpaPlot(gpa_plot.current, course.avg_gpa_year);
    }
  }, [gpa_plot, course]);

  return (
    <a.div className={classes.root} style={spring}>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <TextCard title="Course name" text={course && course.courseName} />
        </Grid>
        <Grid item xs={4}>
          <TextCard
            title="Professor names"
            text={course && course.profName.join("\n")}
          />
        </Grid>
        <Grid item xs={4}>
          <TextCard title="Section" text={course && course.courseSection} />
        </Grid>

        <Grid item xs={12}>
          <TextCard
            title="Course description"
            text={course && course.courseDesc}
          />
        </Grid>

        <Grid item xs={6}>
            <svg id='gradePlot' ref={plot} />
        </Grid>

        <Grid item xs={6}>
          <svg id='gpaPlot' ref={gpa_plot} />
        </Grid>

      </Grid>
    </a.div>
  );
}
