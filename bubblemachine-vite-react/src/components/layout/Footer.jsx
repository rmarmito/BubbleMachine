import { Box, Typography } from "@mui/material";
import { useTheme } from "../../styles/context/ThemeContext.jsx";
import { footerStyles } from "../../styles/context/LayoutStyles.jsx";
import { useState } from "react";

const MusicNote = ({ delay, position, size }) => (
  <Box
    component="span"
    sx={{
      ...footerStyles.musicNote,
      animationDelay: `${delay}s`,
      left: `${position}%`,
      bottom: "-20px",
      fontSize: size,
    }}
  >
    {["♪", "♫", "♩", "♬"][Math.floor(Math.random() * 4)]}
  </Box>
);

const Footer = () => {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  // Generate random music notes
  const [musicNotes] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      position: Math.random() * 100,
      size: Math.random() * 10 + 20 + "px",
    }))
  );

  return (
    <Box component="footer" sx={footerStyles.wrapper(darkMode)}>
      <Box sx={footerStyles.noteAnimation} /> {/* Apply keyframes */}
      {musicNotes.map((note) => (
        <MusicNote
          key={note.id}
          delay={note.delay}
          position={note.position}
          size={note.size}
        />
      ))}
      {/* Audio Wave Animation */}
      <Box sx={footerStyles.waveContainer}>
        {[...Array(12)].map((_, index) => (
          <Box
            key={index}
            sx={{
              ...footerStyles.waveBar,
              ...footerStyles.wave,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </Box>
      {/* Footer Content */}
      <Box sx={footerStyles.content}>
        <Typography sx={footerStyles.gradientText(darkMode)}>
          Made with
          <Box component="span" sx={footerStyles.pulsingNote}>
            ♪
          </Box>
          by BubbleMachine
        </Typography>

        <Typography sx={footerStyles.copyright}>
          © {currentYear} BubbleMachine. All rights reserved.
        </Typography>
      </Box>
      {/* Background Gradient Overlay */}
      <Box sx={footerStyles.gradient(darkMode)} />
    </Box>
  );
};

export default Footer;
