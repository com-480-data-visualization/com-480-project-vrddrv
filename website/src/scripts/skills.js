import * as d3 from "d3";
import { RadarChart } from "./radar_chart";
import { DefaultDict } from "./helpers";

export function showSkills(data) {
  d3.select("#course").attr("width", "0");
  d3.select("#plot").attr("width", "0");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "src/processed_data/course_programs.json", true);
  xhr.responseType = "blob";
  xhr.onload = function (e) {
    if (this.status == 200) {
      var file = new File([this.response], "temp");
      var fileReader = new FileReader();
      fileReader.addEventListener("load", function () {
        const res = JSON.parse(fileReader.result);
        showSkillsForPrograms(data, res);
      });
      fileReader.readAsText(file);
    }
  };
  xhr.send();
}

function showSkillsForPrograms(data, course_programs, programs_to_show = 7) {
  let programs = new DefaultDict(0);

  data.forEach((course) => {
    const course_name = course.name.toLowerCase();
    if (course_name in course_programs) {
      course_programs[course_name].forEach((program) => {
        programs[program] += course.credits;
      });
    } else {
      console.log(course_name);
    }
  });

  programs = Object.entries(programs);
  programs.sort((a, b) => (a[1] < b[1] ? 1 : -1));
  programs = programs.slice(0, programs_to_show);
  console.log(programs);

  var margin = { top: 50, right: 80, bottom: 50, left: 80 },
    width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

  var radar_data = [
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
    radar_data[0].axes.push({
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
    color: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
    format: ".0f",
  };

  RadarChart(".radarChart", radar_data, radarChartOptions);
}

function prettifyProgramName(program) {
  return program
    .replace("_master_program", "")
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}
