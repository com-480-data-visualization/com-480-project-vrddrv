import React from "react";
import { Grid, Card, Paper, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextCard } from "./text_card";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export function Course(props) {
  const classes = useStyles();
  console.log(props.course["profName"].join("\n"));

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <TextCard title="Course name" text={props.course["courseName"]} />
        </Grid>
        <Grid item xs={4}>
          <TextCard
            title="Professor names"
            text={props.course["profName"].join(" ")}
          />
        </Grid>
        <Grid item xs={4}>
          <TextCard title="Section" text={props.course["courseSection"]} />
        </Grid>
        <Grid item xs={12}>
          <TextCard
            title="Course description"
            text={props.course["courseDesc"]}
          />
        </Grid>
      </Grid>
    </div>
  );
}
