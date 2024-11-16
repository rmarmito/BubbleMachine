import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import WaveformVis from "./components/waveform/WaveformVis";
import ErrorPage from "./pages/ErrorPage";
import SplashScreen from "./pages/SplashScreen";
import { ThemeProvider } from "./styles/context/ThemeContext";
import "./styles/App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <CssBaseline />
      {isLoading ? (
        <SplashScreen onLoadComplete={() => setIsLoading(false)} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/waveform" element={<WaveformVis />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}

export default App;
