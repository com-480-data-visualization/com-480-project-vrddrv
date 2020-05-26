"use strict";

import React from "react";

export function Tooltip(props) {
  return (
    <div
      id="petalTooltip"
      style={{ position: "absolute", top: props.pos[0], left: props.pos[1] }}
    >
      <h3>{props.data.name}</h3>
      <p />
      <p>Grade: {props.data.grade}</p>
      <p>Credits: {props.data.credits}</p>
      <p />
      {props.data.lang ? <p>Language: {props.data.lang}</p> : <p></p>}
      {props.data.lang ? <p>Exam date: {props.data.sdate}</p> : <p></p>}
    </div>
  );
}
