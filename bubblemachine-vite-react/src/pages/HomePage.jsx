import React from "react";
import BubbleBox from "../components/BubbleBox";
import WaveformVis from "../components/WaveformVis";
import Table from "../components/Table";

export default function HomePage() {
  const audioFile = "https://www.kozco.com/tech/LRMonoPhase4.mp3";

  return (
    <div>
      <BubbleBox
        label="Current File:"
        labelColor="white"
        title=""
        titleColor="#00FF00" // Use a valid color
      >
        <WaveformVis />
      </BubbleBox>

      <BubbleBox
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="#FF0000" // Use a valid color
      >
        <Table/>
      </BubbleBox>

      <BubbleBox />
    </div>
  );
}
