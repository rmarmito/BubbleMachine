import { AppBar, Toolbar, Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../assets/BubbleMachine_Transparent.png";

// Add this CSS to your styles file or use styled-components
const textStyles = {
  textShadowStyle: {
    fontFamily: "Coiny, cursive",
    fontSize: "48px",
    color: "#4E9EE7",
    letterSpacing: "0.5px",
    textShadow: `
      -1px -1px 0 #000,  
       1px -1px 0 #000,
      -1px  1px 0 #000,
       1px  1px 0 #000
    `,
  },
};
const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo and Brand Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: "1",
            marginRight: "auto",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "72px",
              width: "auto",
              marginRight: "10px",
              display: "block",
            }}
          />
          {/* Choose one of the style options */}
          <span style={textStyles.textShadowStyle}>BubbleMachine</span>
        </Box>

        {/* Navigation Items */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Button
            startIcon={<HomeIcon />}
            sx={{
              color: "#666",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            HOME
          </Button>
          <Button
            startIcon={<FolderIcon />}
            sx={{
              color: "#666",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            PROJECTS
          </Button>
          <Button
            startIcon={<SettingsIcon />}
            sx={{
              color: "#666",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            SETTINGS
          </Button>
          <Button
            startIcon={<HelpIcon />}
            sx={{
              color: "#666",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            HELP
          </Button>
          <AccountCircleIcon
            sx={{
              color: "#666",
              marginLeft: "16px",
              fontSize: "32px",
              cursor: "pointer",
              "&:hover": {
                color: "#1976d2",
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
