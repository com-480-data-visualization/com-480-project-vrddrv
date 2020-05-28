"use strict";

import React from "react";
import { Button, Grid, Modal } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import "../../styles/dropzone.scss";

export function DropZone(props) {
  return (
    <div id="dropzone">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <div className="title-container">
          <h3 className="title">By students for students!</h3>
          <p className="description">
            <b className="bold">Ilumni</b> is a set of tools to help you manage
            your studies. Plan your course lists, analyse your perfomance and
            many more. Start by uploading your transcript!
          </p>
        </div>
        <Grid item xs>
          <DropzoneArea
            acceptedFiles={[".pdf"]}
            dropzoneText="Drop your transcript here"
            onDrop={(files) => props.callback(files[0])}
          />
        </Grid>
        <Grid item xs>
          <Button
            variant="contained"
            className="use-transcript-button"
            onClick={() => props.showMockTranscript()}
          >
            Use Mock transcript
          </Button>
        </Grid>
        <p className="disclaimer">
          Disclaimer: current version was tested only in Chrome browser. The
          full list of features is available for EPFL Data Science or Computer
          Science Master students only.
        </p>
        <div className="footer-container">
          <p className="title">
            Developed as part of the project for Data Visualization in EPFL
            2020.
          </p>
          <div className="logo-content">
            <div className="logo" />
          </div>
        </div>
      </Grid>
    </div>
  );
}
