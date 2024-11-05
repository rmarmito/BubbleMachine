import { Box, Typography } from "@mui/material";
import { useTheme } from "../../styles/context/ThemeContext.jsx";
import { footerStyles } from "../../styles/context/LayoutStyles.jsx";

const Footer = () => {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        ...footerStyles.container,
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        borderTop: `1px solid ${darkMode ? "#333" : "#eaeaea"}`,
      }}
    >
      <Box sx={footerStyles.wave}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill={darkMode ? "#121212" : "#f8f9fa"}
          />
        </svg>
      </Box>

      <Box sx={footerStyles.content}>
        <Box sx={footerStyles.innerContent}>
          <Box sx={footerStyles.waveContainer}>
            {[...Array(12)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  ...footerStyles.waveBar,
                  backgroundColor: "primary.main",
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </Box>

          <Typography
            variant="body3"
            sx={{
              color: darkMode ? "text.secondary" : "text.primary",
              fontWeight: 1000,
              textAlign: "center",
            }}
          >
            Made with{" "}
            <Box component="span" sx={footerStyles.musicNote}>
              ♪
            </Box>{" "}
            by BubbleTea(m)
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: darkMode ? "text.disabled" : "text.secondary",
            }}
          >
            © {currentYear} BubbleMachine. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
