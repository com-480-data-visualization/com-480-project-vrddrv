"use strict";

import React from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { Skills } from "./skills";
import { HintSkillsScreen, HelpButton } from "./hints";

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
          style={{
              borderRadius: 20
          }}
        >
          Back to the main screen
        </Button>
      </ButtonGroup>
      <Skills
        data={props.transcript.classes}
        transitionTimeScale={props.transitionTimeScale}
      />
      <HintSkillsScreen
        transitionTimeScale={props.transitionTimeScale}
        showHints={props.showHints}
        changeShowHints={props.changeShowHints}
      />

      <HelpButton
        showHints={props.showHints}
        changeShowHints={props.changeShowHints}
      />
    </>
  );
}
