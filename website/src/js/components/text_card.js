import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

export function TextCard(props) {
  const preventDefault = (event) => event.preventDefault();

  function makeURL(courseName, courseCode) {
    let url = "https://edu.epfl.ch/coursebook/en/";
    const splitCourse = courseName
      .split(/'| : | - |: |, |\. | \& | /)
      .map((i) => {
        return i.replace(/\)|\(/g, "").toLowerCase();
      });
    for (const each of splitCourse) {
      url = url + each + "-";
    }
    if (courseCode.match(/\([a-z]\)/)) {
      url =
        url +
        courseCode.slice(0, -3) +
        "-" +
        courseCode.slice(-2, -1).toUpperCase() +
        "?cb_cycle=bama_cyclemaster";
    } else {
      url = url + courseCode + "?cb_cycle=bama_cyclemaster";
    }
    console.log(url);
    return url;
  }

  return (
    <Card style={{ height: "100%" }}>
      <CardContent>
        <Typography gutterBottom variant="subtitle1" component="h2">
          {props.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          style={{ whiteSpace: "pre-line" }}
        >
          {props.isURL ? (
            <Link
              href="#"
              onClick={() => {
                if (props.isURL) {
                  const win = window.open(
                    makeURL(props.text, props.courseCode),
                    "_blank"
                  );
                  win.focus();
                }
              }}
            >
              {props.text}
            </Link>
          ) : (
            props.text
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}
