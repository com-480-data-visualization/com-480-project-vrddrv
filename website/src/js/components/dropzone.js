"use strict";

import React from "react";

export function DropZone(props) {
  const [showBox, setShowBox] = React.useState(true);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.callback(e);
    setShowBox(false);
  };

  return (
    <div
      className="DropZone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      style={{ display: showBox ? "block" : "none" }}
    >
      <h1>Drag and drop your transcript here!</h1>
    </div>
  );
};

// export class DropZone {
//   constructor(canvasWidth, canvasHeight, dropHandler) {
//     let dropZone = d3.select("svg#plot").append("g").attr("id", "drop_zone");

//     dropZone
//       .append("rect")
//       .attr("x", 0)
//       .attr("y", 0)
//       .attr("width", canvasWidth)
//       .attr("height", canvasHeight);

//     dropZone
//       .append("text")
//       .attr("x", canvasWidth / 2)
//       .attr("y", canvasHeight / 2)
//       .text("Drop your Transcript here");

//     dropZone
//       .on("drop", dropHandler)
//       .on("dragover", () => {
//         d3.event.preventDefault(); // Prevents file from being opened on drop
//       })
//       .on("mouseover", function (d, i) {
//         d3.select(this).attr("opacity", "0.8");
//       })
//       .on("mouseout", function (d, i) {
//         d3.select(this).attr("opacity", "1.0");
//       });
//   }
// }
