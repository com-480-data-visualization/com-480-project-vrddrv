"use strict";

import React from "react";

export function DropZone(props) {
  const [showBox, setShowBox] = React.useState(true);
  const [opacity, setOpacity] = React.useState(1.0);

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
      onMouseOver={() => setOpacity(0.8)}
      onMouseLeave={() => setOpacity(1.0)}
      style={{ display: showBox ? "block" : "none", opacity: opacity }}
    >
      <h1>Drag and drop your transcript here!</h1>
    </div>
  );
}
