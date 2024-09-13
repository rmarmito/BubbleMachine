import React from "react";
import BubbleBox from "../components/BubbleBox";
import WaveformVisualizer from "../components/WaveformVisualizer"; // Correct import path

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
        <WaveformVisualizer audioFile={audioFile} />
      </BubbleBox>

      <BubbleBox
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="#FF0000" // Use a valid color
      >
        Bubble Layer will go here
      </BubbleBox>

      <BubbleBox />
    </div>
  );
}
