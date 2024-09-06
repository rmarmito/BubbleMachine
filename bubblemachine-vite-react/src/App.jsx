import React from "react";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
// import WaveformVis from "./pages/WaveformVis";
import BubbleLayer from "./pages/BubbleLayer";
import HomePage from "./pages/HomePage";
import RickRollAudio from "./assets/RickRoll.mp3";
// import { WaveformVisualizer } from "./components/WaveformVisualizer.jsx";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            {/* <Route path="/waveform" element={<WaveformPage />} /> */}

            {/* <Route path="/Bubble" element={<BubbleLayer />} /> */}
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
