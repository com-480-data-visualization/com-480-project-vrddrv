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
          Back to the main screen
        </Button>
      </ButtonGroup>
      <Skills
        data={props.transcript.classes}
        transitionTimeScale={props.transitionTimeScale}
      />
    </>
  );
}
