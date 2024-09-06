import React from "react";
import BubbleBox from "../components/BubbleBox";
// import WaveformVisualizer from "./components/WaveformVisualizer";
// import WaveformPage from "./WaveformPage.jsx";

export default function HomePage() {
  const audioFile = "./assets/RickRoll.mp3";

  return (
    <div>
      <BubbleBox
        label="Current File:"
        labelColor="white"
        title=""
        titleColor="SECOND COLOR"
      ></BubbleBox>

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
