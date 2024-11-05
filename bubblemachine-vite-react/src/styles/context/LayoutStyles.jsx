export const headerStyles = {
  appBar: (darkMode) => ({
    backgroundImage: "none",
    backgroundColor: darkMode ? "#1A1A2E" : "#2C3E50", // Deep, professional color
    boxShadow: "none",
    borderBottom: `1px solid ${darkMode ? "#2A2A3E" : "#34495E"}`,
    position: "fixed",
  }),
  bubble: {
    position: "absolute",
    borderRadius: "50%",
    pointerEvents: "none",
    animation: "float 5s infinite",
    opacity: 0.1,
    background: "radial-gradient(circle at 30% 30%, #ffffff, transparent)",
  },
  toolbar: {
    justifyContent: "space-between",
    minHeight: "64px",
    position: "relative",
    overflow: "hidden",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    flex: "1",
    marginRight: "auto",
    zIndex: 1,
  },
  logo: {
    height: "45px",
    width: "auto",
    marginRight: "10px",
    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.2))",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05) rotate(-5deg)",
    },
  },
  brandText: (darkMode) => ({
    fontFamily: "Coiny, cursive",
    fontSize: "38px",
    background: "linear-gradient(45deg, #E3F2FD, #90CAF9)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    textShadow: darkMode
      ? "2px 2px 4px rgba(0,0,0,0.5)"
      : "1px 1px 2px rgba(0,0,0,0.3)",
    position: "relative",
  }),
  navContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    zIndex: 1,
  },
  iconButton: {
    color: "#fff",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0) scale(1)",
    },
    "50%": {
      transform: "translateY(-20px) scale(1.1)",
    },
  },
};
export const footerStyles = {
  container: {
    position: "relative",
    marginTop: "auto",
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    overflow: "hidden",
    lineHeight: 0,
    transform: "rotate(180deg)",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 3,
    px: 2,
    position: "relative",
    zIndex: 1,
  },
  innerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  },
  waveContainer: {
    display: "flex",
    gap: 0.5,
    mb: 1,
  },
  waveBar: {
    width: "3px",
    height: "15px",
    animation: "waveAnimation 1s ease-in-out infinite",
    "@keyframes waveAnimation": {
      "0%, 100%": {
        transform: "scaleY(0.5)",
      },
      "50%": {
        transform: "scaleY(1)",
      },
    },
  },
  musicNote: {
    display: "inline-block",
    animation: "pulse 1.5s ease infinite",
    "@keyframes pulse": {
      "0%": {
        transform: "scale(1)",
      },
      "50%": {
        transform: "scale(1.2)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
  },
};

export const containerStyles = {
  paper: (darkMode) => ({
    backgroundColor: darkMode ? "#1A1A2E" : "#FFFFFF",
    borderRadius: "12px",
    overflow: "hidden",
    border: `1px solid ${darkMode ? "#2A2A3E" : "#E0E0E0"}`,
    boxShadow: darkMode
      ? "0 4px 20px rgba(0,0,0,0.2)"
      : "0 4px 20px rgba(0,0,0,0.05)",
  }),
  header: (darkMode) => ({
    backgroundColor: darkMode ? "#2C3E50" : "#34495E",
    padding: "16px",
    color: "#FFFFFF",
  }),
};
