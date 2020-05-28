import React, { useRef, useEffect } from "react";
import { Grid, Paper, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextCard } from "./text_card";
import { useSpring, a } from "react-spring";
import { gradeHistogram } from "./grade_histogram";
import { gpaPlot } from "./gpa_curve";
import { Close, Help } from "@material-ui/icons/";

const useStyles = makeStyles((theme) => ({
  root: {
    top: "80px",
    left: "20px",
    width: "20%",
    position: "absolute",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  IconButton: {
    top: "0px",
    right: "0px",
    position: "absolute",
  },
}));

export function HintMainScreen(props) {
  const classes = useStyles();
  const spring = useSpring({
    transform:
      props.course || !props.showHints ? "translateX(-110%)" : "translateX(0%)",
    from: {
      transform: "translateX(-110%)",
    },
    config: {
      duration: props.transitionTimeScale,
    },
  });

  return (
    <a.div className={classes.root} style={spring}>
      <Paper className={classes.paper}>
        <IconButton
          className={classes.IconButton}
          aria-label="close"
          component="span"
          onClick={() => props.changeShowHints(false)}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" gutterBottom></Typography>
        <Typography variant="h5" gutterBottom>
          Welcome to Ilumni!
        </Typography>
        <Typography variant="body2" gutterBottom>
          On this page you can see general information about your studies. The
          flower in the center represents you progress on the way to the
          diploma, it will be fullfilled when you obtain all credits for your
          program. The visualizations are interactive, try them!
        </Typography>
        <Typography variant="body2" gutterBottom>
          To the right from the flower you can see your progress in the
          requirements of you programm. You will sucesfully finish your Masters
          when those are met!
        </Typography>
        <Typography variant="body2" gutterBottom>
          To plan your next semester you can manually add classes from the list
          right above and see how each class affects your progress! We also
          prepared a simple recomendation system to help you with a search for
          right classes. Try it by hitting the "Sugest courses" button!
        </Typography>
        <Typography variant="body2" gutterBottom>
          If you are about to finish your studies and already have everything
          planned - take a look at the skills you have obtained at EPFL by
          clicking "Show Skills"!
        </Typography>
      </Paper>
    </a.div>
  );
}

const useStylesRight = makeStyles((theme) => ({
  root: {
    top: "80px",
    right: "20px",
    width: "20%",
    position: "absolute",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  IconButton: {
    top: "0px",
    right: "0px",
    position: "absolute",
  },
}));

export function HintCourseScreen(props) {
  const classes = useStylesRight();
  const spring = useSpring({
    transform:
      props.course && props.showHints ? "translateX(0%)" : "translateX(110%)",
    from: {
      transform: "translateX(110%)",
    },
    config: {
      duration: props.transitionTimeScale,
    },
  });

  return (
    <a.div className={classes.root} style={spring}>
      <Paper className={classes.paper}>
        <IconButton
          className={classes.IconButton}
          aria-label="close"
          component="span"
          onClick={() => props.changeShowHints(false)}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" gutterBottom>
          Course Description
        </Typography>
        <Typography variant="body2" gutterBottom>
          On this page you can find some information about the class you have
          clicked.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Probably the most important here are two plots which can give you a
          notion of how difficult class is. The first one shows a histogram of
          grades which were reported to us by other studetns. If you completed
          this class - the bar with your grade will be colored in violet.
        </Typography>
      </Paper>
    </a.div>
  );
}

const useStylesSkills = makeStyles((theme) => ({
  root: {
    top: "80px",
    left: "20px",
    width: "20%",
    position: "absolute",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  IconButton: {
    top: "0px",
    right: "0px",
    position: "absolute",
  },
}));

export function HintSkillsScreen(props) {
  const classes = useStylesSkills();
  const spring = useSpring({
    transform: props.showHints ? "translateX(0%)" : "translateX(-110%)",
    from: {
      transform: "translateX(-110%)",
    },
    config: {
      duration: props.transitionTimeScale,
    },
  });

  return (
    <a.div className={classes.root} style={spring}>
      <Paper className={classes.paper}>
        <IconButton
          className={classes.IconButton}
          aria-label="close"
          component="span"
          onClick={() => props.changeShowHints(false)}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" gutterBottom>
          Skills Diagram
        </Typography>
        <Typography variant="body2" gutterBottom>
          During your Masters you have taken a lot of different classes.
          Majority of them are shared with other programs. Could that happen
          that studding on one program you also got enough knowledge to get a
          diploma in another major? Check it out on this visualization of your
          skills!
        </Typography>
      </Paper>
    </a.div>
  );
}


const useHelpBtn = makeStyles((theme) => ({
  root: {
    bottom: "20px",
    right: "20px",
    position: "absolute",
    color: "#ffffff"
  }
}));


export function HelpButton(props) {
  const classes = useHelpBtn();

  return (
    <IconButton
      className={classes.root}
      aria-label="help"
      component="span"
      onClick={() => props.changeShowHints(!props.showHints)}
    >
      <Help />
    </IconButton>
  );
}
