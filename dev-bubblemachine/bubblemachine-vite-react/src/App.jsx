import React from "react";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
import WaveformVis from "./pages/WaveformVis";
import BubbleLayer from "./pages/BubbleLayer";
import "./App.css";
import{
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<WaveformVis />} />
        <Route path="/Bubble" element={<BubbleLayer />} />
        <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
