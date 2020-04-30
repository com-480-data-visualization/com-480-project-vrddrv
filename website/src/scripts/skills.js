import * as d3 from "d3";
import { RadarChart } from "./radar_chart";
import { DefaultDict } from "./helpers";

const coursePrograms = require("../processed_data/course_programs.json");

export function showSkills(data) {
  document.getElementById("blockContainer").style.display="none";
  document.getElementById("plot").style.display="none";
  document.getElementById("radar_chart").style.display="inline";
  // d3.select("#course").attr("width", "0");
  // d3.select("#plot").attr("width", "0");

  showSkillsForPrograms(data, coursePrograms);
}

function showSkillsForPrograms(data, coursePrograms, programsToShow = 7) {
  let programs = new DefaultDict(0);

  data.forEach((course) => {
    const courseName = course.name.toLowerCase();
    if (courseName in coursePrograms) {
      coursePrograms[courseName].forEach((program) => {
        programs[program] += course.credits;
      });
    } else {
      console.log(courseName);
    }
  });

  programs = Object.entries(programs);
  programs.sort((a, b) => (a[1] < b[1] ? 1 : -1));
  programs = programs.slice(0, programsToShow);
  console.log(programs);

  var margin = { top: 50, right: 80, bottom: 50, left: 80 },
    width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

  var radarData = [
    {
      name: "All skills",
      axes: [],
      color: "#26AF32",
    },
    // {
    //   name: "Core skills",
    //   axes: [
    //     { axis: "Data Science", value: 50 },
    //     { axis: "Computer Science", value: 30 },
    //     { axis: "Life Science", value: 20 },
    //     { axis: "Mechanical Engineering", value: 10 },
    //     { axis: "Cyber Security", value: 35 },
    //   ],
    //   color: "#762712",
    // },
  ];

  programs.forEach((program) => {
    radarData[0].axes.push({
      axis: prettifyProgramName(program[0]),
      value: program[1],
    });
  });

  var radarChartOptions = {
    w: 300,
    h: 400,
    margin: margin,
    levels: 5,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(["#26AF32"]),
    format: ".0f",
  };

  RadarChart(".radarChart", radarData, radarChartOptions);
}

function prettifyProgramName(program) {
  return program
    .replace("_master_program", "")
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}
