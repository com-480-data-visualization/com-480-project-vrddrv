import React from "react";
import { Grid, Paper, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: "20px",
    left: "35px",
    position: "absolute",
    color: "white",
    height: "15%"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    overflow: "auto",
  },
  IconButton: {
    top: "0px",
    right: "0px",
    position: "absolute",
  },
}));

export function Legend() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="body2" style={{backgroundColor: "#d32f2f", color: "white", borderRadius: "15px"}} gutterBottom>
        &ensp; Core &ensp;
        </Typography>
        <Typography variant="body2" style={{backgroundColor: "#f57c00", color: "white", borderRadius: "15px"}} gutterBottom>
        &ensp; Optional &ensp;
        </Typography>
        <Typography variant="body2" style={{backgroundColor: "#9a0036", color: "white", borderRadius: "15px"}} gutterBottom>
        &ensp; SHS &ensp;
        </Typography>
        <Typography variant="body2" style={{backgroundColor: "#b5076b", color: "white", borderRadius: "15px"}} gutterBottom>
        &ensp; Thesis &ensp;
        </Typography>
        <Typography variant="body2" style={{backgroundColor: "#ef9a9a", color: "white", borderRadius: "15px"}} gutterBottom>
        &ensp; Not in program &ensp;
        </Typography>
      </Paper>
    </div>
  );
}