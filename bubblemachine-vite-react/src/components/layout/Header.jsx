import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Fade,
  Avatar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "../../assets/BubbleMachine_Transparent.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textStyles = {
    textShadowStyle: {
      fontFamily: "Coiny, cursive",
      fontSize: "26px",
      color: "#1976d2",
      letterSpacing: "0.5px",
      textShadow: `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000`,
    },
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.9)" : "white",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "all 0.3s ease-in-out",
        boxShadow: scrolled
          ? "0 2px 8px rgba(0,0,0,0.1)"
          : "0 2px 4px rgba(0,0,0,0.1)",
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
              height: "45px",
              width: "auto",
              marginRight: "10px",
              display: "block",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
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
          {/* Navigation Buttons */}
          <Button
            startIcon={<HomeIcon />}
            sx={{
              color: "#666",
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                transform: "translateY(-2px)",
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
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                transform: "translateY(-2px)",
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
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                transform: "translateY(-2px)",
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
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            HELP
          </Button>

          {/* Theme Toggle */}
          <Tooltip
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": { transform: "rotate(180deg)" },
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={(e) => setNotificationAnchor(e.currentTarget)}
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                marginLeft: "8px",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#1976d2",
                }}
              >
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>My Projects</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => setNotificationAnchor(null)}>
          New comment on Project A
        </MenuItem>
        <MenuItem onClick={() => setNotificationAnchor(null)}>
          Project B was updated
        </MenuItem>
        <MenuItem onClick={() => setNotificationAnchor(null)}>
          System update available
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
