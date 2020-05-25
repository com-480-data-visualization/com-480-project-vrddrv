import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import { RadarChart } from "../radar_chart";
import { DefaultDict } from "../helpers";

const coursePrograms = require("../../processed_data/course_programs.json");

export function Skills(props) {
  const node = useRef();
  useEffect(() => {
    if (node.current) {
      showSkillsForPrograms(node.current, props.data, coursePrograms);
    }
  }, [node]);

  return <div className="radarChart" id="radar_chart" ref={node}></div>;
}

function showSkillsForPrograms(
  parent_selector,
  data,
  coursePrograms,
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

  var margin = { top: 50, right: 80, bottom: 50, left: 80 };
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
    w: 300,
    h: 400,
    margin: margin,
    levels: 5,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
    format: ".0f",
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
