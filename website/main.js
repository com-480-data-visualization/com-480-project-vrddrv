"use strict";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const TRANSITION_TIME_SCALE = 2000;

const CIRC_PLOT_RADIUS = 40;
const PETALS_LENGTH = 40;

//TODO: 120 should be parsed
const MAX_NUMBER_CREDITS = 120;
const VALID_BLOCK_NAMES = {
  "Group 1": "class_core",
  Options: "class_optional",
  'SHS"': "class_shs",
};
const VALID_SESSION_DATES = ["02.2020", "02.2019"];

function dragOverHandler(ev) {
  ev.preventDefault(); // Prevents file from being opened on drop
}

function dropHandler(ev) {
  ev.preventDefault();

  if (ev.dataTransfer.items && ev.dataTransfer.items[0].kind === "file") {
    var file = ev.dataTransfer.items[0].getAsFile();
    file.text().then(extractDataFromPDF);
  }
}

function extractDataFromPDF(pdfData) {
  var pdfjsLib = window["pdfjs-dist/build/pdf"];
  pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.js";

  // Load binary data from the obtained file
  var loadingTask = pdfjsLib.getDocument({ data: pdfData });
  loadingTask.promise.then(
    function (pdfInstance) {
      console.log("PDF loaded");

      // TODO: Now we work only with the first page!
      pdfInstance.getPage(1).then((pdfPage) => {
        pdfPage.getTextContent().then(function (textContent) {
          // console.log(textContent.items);
          var parsedData = itemsPDFToDataInstance(textContent.items);

          console.log("Parsed data: ", parsedData);

          let circularPlot = new CircularPlot(parsedData);
        });
      });
    },
    function (reason) {
      // PDF loading error
      console.error(reason);
    }
  );
}

function itemsPDFToDataInstance(itemsArray) {
  let classesData = [];
  let currentBlock;

  for (let idx = 0; idx < itemsArray.length; idx++) {
    // Keep track of current block
    if (Object.keys(VALID_BLOCK_NAMES).includes(itemsArray[idx].str)) {
      currentBlock = VALID_BLOCK_NAMES[itemsArray[idx].str];
    }

    // Detect subject line by session date
    if (VALID_SESSION_DATES.includes(itemsArray[idx].str)) {
      let name = "",
        form = itemsArray[idx - 2].str;
      // TODO: now name is extracted in a very unrobust way:
      // 1. Check if it was attached to the form item
      let split = form.split(" ");
      if (split.length > 0) {
        name = split.slice(0, -1).join(" ");
        form = split[split.length - 1];
      }

      // 2. Take next left item while name has small letter first
      let nameIdx = idx - 1;
      while ((name === "" || name[0] == name[0].toLowerCase()) && nameIdx > 2) {
        name = itemsArray[nameIdx - 2].str + " " + name;
        nameIdx -= 1;
      }

      var subject = {
        name: name,
        form: form,
        lang: itemsArray[idx - 1].str,
        sdate: itemsArray[idx].str,
        grade: Number.parseFloat(itemsArray[idx + 1].str),
        creditsOf: Number.parseInt(itemsArray[idx + 2].str),
        credits: Number.parseInt(itemsArray[idx + 3].str),
        block: currentBlock,
      };

      classesData.push(subject);
    }
  }

  return classesData;
}

class DropZone {
  constructor() {
    let dropZone = d3.select("svg#plot").append("g").attr("id", "drop_zone");

    dropZone
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", CANVAS_WIDTH)
      .attr("height", CANVAS_HEIGHT);

    dropZone
      .append("text")
      .attr("x", CANVAS_WIDTH / 2)
      .attr("y", CANVAS_HEIGHT / 2)
      .text("Drop your Transcript here");

    dropZone
      .attr("ondrop", "dropHandler(event)")
      .attr("ondragover", "dragOverHandler(event)")
      .on("mouseover", function (d, i) {
        d3.select(this).attr("opacity", "0.8");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("opacity", "1.0");
      });
  }
}

class CircularPlot {
  constructor(data) {
    // To make the plot more interesting
    // shuffleArray(data);

    this.total_credits = 0; //data.reduce((v, t) => v + t.credits, 0);
    for (let idx = 0; idx < data.length; idx++) {
      data[idx].creditsBefore = this.total_credits;
      this.total_credits += data[idx].credits;
    }

    this.gpa =
      data.reduce((t, v) => t + v.credits * v.grade, 0) / this.total_credits;

    this.arcGenerator = d3
      .arc()
      .innerRadius(CIRC_PLOT_RADIUS)
      .cornerRadius(2)
      .outerRadius((d) => (d.grade / 6) * PETALS_LENGTH + CIRC_PLOT_RADIUS)
      .startAngle(0)
      .endAngle((d) => -((2 * Math.PI * d.credits) / MAX_NUMBER_CREDITS));

    // Delete Everything from the plot
    d3.select("svg#plot > *").remove();

    let circPlot = d3
      .select("svg#plot")
      .append("g")
      .attr("id", "circular_plot")
      .attr(
        "transform",
        `translate(${CANVAS_WIDTH / 2}, ${CANVAS_HEIGHT / 2})`
      );

    let сircPlotcore = circPlot.append("g").attr("id", "circular_plot_core");

    сircPlotcore.append("circle").attr("r", CIRC_PLOT_RADIUS);

    сircPlotcore
      .append("text")
      .attr("y", -15)
      .text("GPA");

    сircPlotcore
      .append("text")
      .attr("id", "GPA")
      .text(this.gpa.toPrecision(3).toString());

    сircPlotcore
      .append("text")
      .attr("y", CIRC_PLOT_RADIUS / 2)
      .text(`Credits: ${this.total_credits.toString()} / ${MAX_NUMBER_CREDITS}`)
      .attr("style", "font-size: 5px");

    // Create Petals
    let petalsEnter = circPlot
      .selectAll(".petal")
      .data(data)
      .enter()
      .append("g")
      .attr("class", (d) => "petal " + d.block);

    petalsEnter
      .on("click", function (d) {
        alert("You clicked on " + d.name);
      })
      .on("mouseover", function () {
        d3.select(this).attr("opacity", "0.8");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", "1.0");
      });

    petalsEnter
      .append("path")
      .attr("id", function (d, i) {
        return "block_" + i;
      })
      .attr("d", this.arcGenerator);

    // TODO: create a class or smth to compute all these shifts
    petalsEnter
      .append("text")
      .text((d) =>
        d.name
          .split(" ")
          .map((d) => (d == "and" ? "&" : d[0]))
          .join("")
          .toUpperCase()
      )
      .attr(
        "x",
        (d) => -(((d.grade / 6) * PETALS_LENGTH) / 2 + CIRC_PLOT_RADIUS)
      )
      .attr(
        "transform",
        (d) =>
          `rotate(${
            (90 - 360 * (d.credits / 2 - MAX_NUMBER_CREDITS / 4)) /
            MAX_NUMBER_CREDITS
          })`
      );

    // parseInt(d3.select(this).node().getBoundingClientRect().height)
    // parseInt(d3.select(this).node().getBoundingClientRect().width)

    // Open Animations
    petalsEnter
      .attr("transform", `rotate(0)`)
      .transition()
      .duration(TRANSITION_TIME_SCALE)
      .attr(
        "transform",
        (d) => `rotate(${(-360 * d.creditsBefore) / MAX_NUMBER_CREDITS})`
      );

    circPlot
      .attr(
        "transform",
        `matrix(0,0,0,0,${CANVAS_WIDTH / 2},${CANVAS_HEIGHT / 2})`
      )
      .transition()
      .duration(0.8 * TRANSITION_TIME_SCALE)
      .attr(
        "transform",
        `matrix(1,0,0,1,${CANVAS_WIDTH / 2},${CANVAS_HEIGHT / 2})`
      );
  }
}

function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    action();
  }
}

whenDocumentLoaded(() => {
  new DropZone();
});

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
