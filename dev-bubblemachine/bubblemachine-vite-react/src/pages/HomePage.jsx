import React from "react";
import BubbleBox from "../components/BubbleBox";
import WaveformVisualizer from "./WaveformVis.jsx";

export default function HomePage() {
  return (
    <div>
      <BubbleBox
        label="Current File:"
        labelColor="white"
        title=""
        titleColor="SECOND COLOR"
      >
        <WaveformVisualizer />
      </BubbleBox>

      <BubbleBox
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="SECOND COLOR"
      >
        Bubble Layer will go here
      </BubbleBox>

      <BubbleBox />
    </div>
  );
}
