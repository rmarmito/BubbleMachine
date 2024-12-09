import { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Fade } from "@mui/material";
import logo from "../assets/BubbleMachine_Transparent.png";

const loadingMessages = [
  "Warming up the bubbles...",
  "Calibrating wave surfer...",
  "Preparing the machine...",
  "Getting off the wiggly path...",
  "Almost there...",
];

const SplashScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Progress bar animation
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 20, 100);
        if (newProgress === 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onLoadComplete, 500);
          }, 500);
        }
        return newProgress;
      });
    }, 500);

    // Loading message rotation
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 750);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [onLoadComplete]);

  return (
    <Fade in={!fadeOut} timeout={1000}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <img
            src={logo}
            alt="BubbleMachine Logo"
            className="splash-logo"
            style={{
              width: "150px",
              height: "auto",
            }}
          />
          <Typography
            variant="h3"
            className="splash-text"
            sx={{
              fontFamily: "Coiny, cursive",
              color: "primary.main",
              textShadow: `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000`,
              mb: 4,
            }}
          >
            BubbleMachine
          </Typography>
          <Box sx={{ width: "300px" }} className="splash-progress">
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(25, 118, 210, 0.2)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundColor: "primary.main",
                },
              }}
            />
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {Math.round(progress)}%
              </Typography>
              <Fade in={true} timeout={300} key={messageIndex}>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ fontStyle: "italic" }}
                >
                  {loadingMessages[messageIndex]}
                </Typography>
              </Fade>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default SplashScreen;
