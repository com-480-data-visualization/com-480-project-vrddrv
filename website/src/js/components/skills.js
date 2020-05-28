import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import { RadarChart } from "../radar_chart";
import { DefaultDict } from "../helpers";

const coursePrograms = require("../../processed_data/course_programs.json");

export function Skills(props) {
  const node = useRef();
  useEffect(() => {
    if (node.current) {
      showSkillsForPrograms(node.current, props.data, coursePrograms, props.transitionTimeScale);
    }
  }, [node]);

  return <div className="radarChart" id="radar_chart" ref={node}></div>;
}

function showSkillsForPrograms(
  parent_selector,
  data,
  coursePrograms,
  transitionTimeScale,
  programsToShow = 7
) {
  let programs = new Object();
  let corePrograms = new Object();

  data.forEach((course) => {
    const courseName = course.name.toLowerCase();
    if (courseName in coursePrograms) {
      coursePrograms[courseName].forEach(([program, type]) => {
        if (!(program in programs)) {
          programs[program] = [0, []];
        }
        programs[program][0] += course.credits;
        programs[program][1].push([courseName, course.credits]);

        if (!(program in corePrograms)) {
          corePrograms[program] = [0, []];
        }
        if (type === "core") {
          corePrograms[program][0] += course.credits;
          corePrograms[program][1].push([courseName, course.credits]);
        }
      });
    } else {
      console.log(courseName);
    }
  });

  programs = Object.entries(programs);
  programs.sort((a, b) => (a[1][0] < b[1][0] ? 1 : -1));
  programs = programs.slice(0, programsToShow);

  let coreProgramsTmp = new Object();
  programs.forEach((x) => {
    coreProgramsTmp[x[0]] = corePrograms[x[0]];
  });
  corePrograms = Object.entries(coreProgramsTmp);

  //width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
  //height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

  var radarData = [
    {
      name: "All skills",
      axes: [],
      color: "#26AF32",
    },
    {
      name: "Core skills",
      axes: [],
      color: "#762712",
    },
  ];

  programs.forEach((program) => {
    radarData[0].axes.push({
      axis: prettifyProgramName(program[0]),
      value: program[1][0],
      info: program[1][1].sort((a, b) => (a[1] > b[1] ? 1 : -1)),
    });
  });
  corePrograms.forEach((program) => {
    radarData[1].axes.push({
      axis: prettifyProgramName(program[0]),
      value: program[1][0],
      info: program[1][1].sort((a, b) => (a[1] > b[1] ? 1 : -1)),
    });
  });

  var radarChartOptions = {
    levels: 1,
    format: ".0f",
    transitionTimeScale: transitionTimeScale,

    labelFactor: 1.6, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 4, //The size of the colored circles of each blog
    opacityCircles: 0.1, //The opacity of the circles of each blob
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)

    unit: "",
    legend: true,
  };

  RadarChart(parent_selector, radarData, radarChartOptions);
}

function prettifyProgramName(program) {
  return program
    .replace("_master_program", "")
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}
