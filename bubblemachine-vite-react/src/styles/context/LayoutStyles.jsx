export const headerStyles = {
  appBar: (darkMode) => ({
    backgroundImage: "none",
    backgroundColor: darkMode ? "#1A1A2E" : "#2C3E50",
    boxShadow: "none",
    borderBottom: `1px solid ${darkMode ? "#2A2A3E" : "#34495E"}`,
    position: "fixed",
  }),
  musicNote: {
    position: "absolute",
    pointerEvents: "none",
    animation: "float 8s infinite linear",
    opacity: 0.1,
    color: "#4E9EE7",
    fontSize: "24px",
  },
  toolbar: {
    justifyContent: "space-between",
    minHeight: "64px",
    position: "relative",
    overflow: "hidden",
  },
  iconButton: {
    color: "#fff",
    transition: "background-color 0.3s ease",
    "&:hover": {
      // Removed transform to eliminate hover animation
      backgroundColor: "rgba(78, 158, 231, 0.2)",
    },
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
    filter: "drop-shadow(0 0 4px rgba(78, 158, 231, 0.3))",
  },
  brandText: (darkMode) => ({
    fontFamily: "Coiny, cursive",
    fontSize: "38px",
    background: `linear-gradient(45deg, #4E9EE7, ${
      darkMode ? "#90CAF9" : "#76B7ED"
    })`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    textShadow: darkMode
      ? "2px 2px 4px rgba(0,0,0,0.5)"
      : "1px 1px 2px rgba(0,0,0,0.3)",
    position: "relative",
  }),
};

export const footerStyles = {
  wrapper: (darkMode) => ({
    position: "relative",
    marginTop: "auto",
    backgroundColor: darkMode ? "#1A1A2E" : "#2C3E50",
    borderTop: `1px solid ${darkMode ? "#2A2A3E" : "#34495E"}`,
    overflow: "hidden",
    padding: "2rem 0",
  }),
  noteAnimation: {
    "@keyframes floatUpward": {
      "0%": {
        transform: "translateY(0) rotate(0deg)",
        opacity: 0,
      },
      "50%": {
        opacity: 0.1,
      },
      "100%": {
        transform: "translateY(-100px) rotate(360deg)",
        opacity: 0,
      },
    },
  },
  musicNote: {
    position: "absolute",
    color: "#4E9EE7",
    opacity: 0.1,
    animation: "floatUpward 10s infinite linear",
  },
  waveContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "4px",
    marginBottom: "1.5rem",
  },
  wave: {
    "@keyframes waveAnimation": {
      "0%, 100%": {
        transform: "scaleY(0.5)",
      },
      "50%": {
        transform: "scaleY(1)",
      },
    },
  },
  waveBar: {
    width: "3px",
    height: "15px",
    backgroundColor: "#4E9EE7",
    animation: "waveAnimation 1s ease-in-out infinite",
  },
  content: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    color: "white",
    zIndex: 1,
  },
  gradientText: (darkMode) => ({
    textAlign: "center",
    background: `linear-gradient(45deg, #4E9EE7, ${
      darkMode ? "#90CAF9" : "#76B7ED"
    })`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  pulsingNote: {
    "@keyframes pulse": {
      "0%, 100%": {
        transform: "scale(1.5)",
      },
      "50%": {
        transform: "scale(1.2)",
      },
    },
    display: "inline-block",
    color: "#4E9EE7",
    animation: "pulse 1.5s ease infinite",
  },
  copyright: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: 300,
    textAlign: "center",
    fontSize: "0.875rem",
  },
  gradient: (darkMode) => ({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: `linear-gradient(to top, ${
      darkMode ? "#1A1A2E" : "#2C3E50"
    }, transparent)`,
    pointerEvents: "none",
  }),
};
export const containerStyles = {
  paper: (darkMode, isHovered) => ({
    margin: 2,
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid",
    borderColor: darkMode
      ? isHovered
        ? "rgba(78, 158, 231, 0.5)"
        : "#2A2A3E"
      : isHovered
      ? "rgba(78, 158, 231, 0.3)"
      : "rgba(0, 0, 0, 0.12)",
    backgroundColor: darkMode ? "#1E1E2E" : "#FFFFFF",
    position: "relative",
    overflow: "hidden",
    boxShadow: isHovered
      ? "0 8px 32px rgba(78, 158, 231, 0.2)"
      : "0 2px 4px rgba(0, 0, 0, 0.05)",
  }),

  header: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#2C3E50",
    color: "white",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    padding: "16px 20px",
    transition: "all 0.3s ease",
  },

  headerTitle: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 2,
  },

  audioFileName: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    "& .icon": {
      color: "#4E9EE7",
      opacity: 0.9,
    },
    "& .name": {
      fontWeight: 500,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "300px",
    },
    "& .extension": {
      opacity: 0.7,
      fontWeight: 400,
    },
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  expandButton: {
    color: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(78, 158, 231, 0.2)",
      transform: "scale(1.1)",
    },
  },

  content: {
    padding: 3,
    transition: "background-color 0.3s ease",
    backgroundColor: "transparent",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  loadingAnimation: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    "& .bar": {
      width: "3px",
      height: "15px",
      backgroundColor: "#4E9EE7",
      borderRadius: "3px",
      animation: "loadingWave 1s ease-in-out infinite",
    },
    "@keyframes loadingWave": {
      "0%, 100%": {
        transform: "scaleY(0.5)",
      },
      "50%": {
        transform: "scaleY(1)",
      },
    },
  },
};

export const appStyles = {
  mainContainer: (darkMode) => ({
    minHeight: "100vh",
    backgroundColor: darkMode ? "#141422" : "#F8FAFC",
    backgroundImage: darkMode
      ? `
        radial-gradient(circle at 10% 20%, rgba(78, 158, 231, 0.03) 0%, transparent 20%),
        radial-gradient(circle at 90% 50%, rgba(78, 158, 231, 0.02) 0%, transparent 20%),
        radial-gradient(circle at 30% 80%, rgba(78, 158, 231, 0.03) 0%, transparent 20%)
      `
      : `
        radial-gradient(circle at 10% 20%, rgba(44, 62, 80, 0.03) 0%, transparent 20%),
        radial-gradient(circle at 90% 50%, rgba(78, 158, 231, 0.02) 0%, transparent 20%),
        radial-gradient(circle at 30% 80%, rgba(44, 62, 80, 0.03) 0%, transparent 20%)
      `,
    backgroundSize: "100% 100%",
    backgroundAttachment: "fixed",
    transition: "background-color 0.3s ease",
  }),

  contentWrapper: {
    paddingTop: "80px",
    paddingBottom: "2rem",
    position: "relative",
    "&::before": {
      content: '""',
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0L30 60" stroke="%234E9EE7" stroke-opacity="0.05" stroke-width="1"/%3E%3Cpath d="M0 30L60 30" stroke="%234E9EE7" stroke-opacity="0.05" stroke-width="1"/%3E%3C/svg%3E")',
      opacity: 0.3,
      pointerEvents: "none",
      zIndex: 0,
    },
  },
};
