"use strict";

import React from "react";

export function CircPlotTooltip(props) {
  return (
    <div
      id="petalTooltip"
      style={{ position: "absolute", top: props.pos[0], left: props.pos[1] }}
    >
      <h3>{props.data.name}</h3>
      <p />
      {!props.data.block.endsWith("suggestion") && <p>Grade: {props.data.grade}</p>}
      <p>Credits: {props.data.credits}</p>
      <p>Block: {getBlock(props.data)}</p>
      <p />
      {props.data.lang ? <p>Language: {props.data.lang}</p> : <p></p>}
      {props.data.lang ? <p>Exam date: {props.data.sdate}</p> : <p></p>}
    </div>
  );
}

function getBlock(data) {
  switch (data.block.split('_')[1]) {
    case "core": return "Core";
    case "optional": return "Optional";
    case "shs": return "Projects & SHS";
    default: return "Not in program";
  }
}
