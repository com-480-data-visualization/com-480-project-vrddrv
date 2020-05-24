"use strict";

import React from "react";
import { Button, Grid } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";

export function DropZone(props) {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={3}
    >
      <Grid item xs>
        <DropzoneArea
          acceptedFiles={[".pdf"]}
          dropzoneText="Drag and drop your transcript here or click"
          onDrop={(files) => props.callback(files[0])}
          clearOnUnmount={true}
        />
      </Grid>
      <Grid item xs>
        <Button variant="contained" onClick={() => props.showMockTranscript()}>
          Use Mock transcript
        </Button>
      </Grid>
    </Grid>
  );
}
