import React, { useRef, useEffect } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextCard } from "./text_card";
import { useSpring, a } from "react-spring";
import { gradeHistogram } from "./grade_histogram";
import { gpaPlot } from "./gpa_curve";

const useStyles = makeStyles((theme) => ({
  root: {
    top: "80px",
    left: "20px",
    width: "50%",
    position: "absolute",
    // backgroundColor: "#e8eaf6",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

export function Course({ transcript, course, transitionTimeScale }) {
  const classes = useStyles();
  const spring = useSpring({
    transform: course ? "translateX(0%)" : "translateX(-110%)",
    config: {
      duration: transitionTimeScale,
    },
  });

  const grades_plot = useRef();
  useEffect(() => {
    if (grades_plot.current && course) {
      let user_grade;
      for (let user_course of transcript.classes ) {
        user_grade = user_course.name === course.courseName ? user_course.grade : user_grade;
      }
      gradeHistogram(grades_plot.current, course.grades_histogram, user_grade);
    }
  }, [grades_plot, course]);

  const gpa_plot = useRef();
  useEffect(() => {
    if (gpa_plot.current && course) {
      gpaPlot(gpa_plot.current, course.avg_gpa_year);
    }
  }, [gpa_plot, course]);

  if (!course) {
    return <></>;
  }

  return (
    <a.div className={classes.root} style={spring}>
      <Grid className={classes.paper} container spacing={1}>
        <Grid item xs={4}>
          <TextCard
            title="Course name"
            text={course.courseName}
            courseCode={course.courseCode}
            isURL={true}
          />
        </Grid>
        <Grid item xs={4}>
          <TextCard
            title="Professor names"
            text={course.profName.join("\n")}
            courseCode={course.courseCode}
            isURL={false}
          />
        </Grid>
        <Grid item xs={4}>
          <TextCard
            title="Section"
            text={course.courseSection}
            courseCode={course.courseCode}
            isURL={false}
          />
        </Grid>

        <Grid item xs={12}>
          <TextCard
            title="Course description"
            text={course.courseDesc}
            courseCode={course.courseCode}
            isURL={false}
          />
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="body1" gutterBottom>
              Grades Distribution
            </Typography>
            <svg
              id="gradePlot"
              ref={grades_plot}
              viewBox="0 0 200 140"
              width="100%"
              length="auto"
            />
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="body1" gutterBottom>
              Average Grade in Years
            </Typography>
            <svg
              id="gpaPlot"
              ref={gpa_plot}
              viewBox="0 0 200 140"
              width="100%"
              length="auto"
            />
          </Paper>
        </Grid>
      </Grid>
    </a.div>
  );
}
