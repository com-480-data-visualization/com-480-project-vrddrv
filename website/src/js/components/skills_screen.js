"use strict";

import React from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { Skills } from "./skills";

export function SkillsScreen(props) {
  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      >
        <Button
          onClick={() => {
            props.setActiveScreen("transcript");
          }}
        >
          Show credits
        </Button>
        <Button onClick={() => props.setActiveScreen("skills")}>
          Show skills
        </Button>
      </ButtonGroup>
      <Skills data={props.transcript.classes} />
    </>
  );
}
