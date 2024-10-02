import React from "react";
import BubbleBox from "../components/BubbleBox";
import WaveformVis from "../components/WaveformVis";
import TableWithProviders from "../components/BubbleTable";
import WaveBubbles from "../components/WaveBubbles";

export default function HomePage() {
  const audioFile = "https://www.kozco.com/tech/LRMonoPhase4.mp3";
  const bubblesData = [{ id: '1', bubbleName: 'Bubble 1', startTime: '00:00', stopTime: '01:00', color: 'Red' }];
  return (
    <div>
      <BubbleBox
        label="Current File:"
        labelColor="white"
        title=""
        titleColor="#00FF00" // Use a valid color
      >
        <WaveBubbles bubblesData = {bubblesData} />
      </BubbleBox>

      <BubbleBox
        label="Bubbles"
        labelColor="white"
        title=""
        titleColor="#FF0000" // Use a valid color
      >
        <TableWithProviders />
      </BubbleBox>
    </div>
  );
}
