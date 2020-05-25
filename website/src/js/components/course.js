import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextCard } from "./text_card";
import { useSpring, a } from "react-spring";

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
      </Grid>
    </a.div>
  );
}
