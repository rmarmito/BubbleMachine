import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccountCircle as AccountIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useTheme } from "../../styles/context/ThemeContext.jsx";
import { headerStyles } from "../../styles/context/LayoutStyles.jsx";
import logo from "../../assets/BubbleMachine_Transparent.png";

const Bubble = ({ delay }) => (
  <Box
    sx={{
      ...headerStyles.bubble,
      width: Math.random() * 30 + 20 + "px",
      height: Math.random() * 30 + 20 + "px",
      left: Math.random() * 100 + "%",
      animationDelay: delay + "s",
    }}
  />
);

const Header = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [bubbles] = useState(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
    }))
  );

  return (
    <AppBar sx={headerStyles.appBar(darkMode)}>
      <Toolbar sx={headerStyles.toolbar}>
        {/* Animated Bubbles */}
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} delay={bubble.delay} />
        ))}

        {/* Logo  */}
        <Box sx={headerStyles.logoContainer}>
          <img src={logo} alt="Logo" style={headerStyles.logo} />
          <Box component="span" sx={headerStyles.brandText(darkMode)}>
            BubbleMachine
          </Box>
        </Box>

        {/* Nabar  Controls */}
        <Box sx={headerStyles.navContainer}>
          <Tooltip
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={headerStyles.iconButton}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="More options">
            <IconButton
              onClick={(e) => setMoreAnchorEl(e.currentTarget)}
              sx={headerStyles.iconButton}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Account settings">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={headerStyles.iconButton}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "transparent",
                  border: "2px solid #fff",
                }}
              >
                <AccountIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Menus */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              backgroundColor: darkMode ? "#1A1A2E" : "#FFFFFF",
              borderRadius: "8px",
              mt: 1,
            },
          }}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
        </Menu>

        <Menu
          anchorEl={moreAnchorEl}
          open={Boolean(moreAnchorEl)}
          onClose={() => setMoreAnchorEl(null)}
          PaperProps={{
            sx: {
              backgroundColor: darkMode ? "#1A1A2E" : "#FFFFFF",
              borderRadius: "8px",
              mt: 1,
            },
          }}
        >
          <MenuItem onClick={() => setMoreAnchorEl(null)}>
            Documentation
          </MenuItem>
          <MenuItem onClick={() => setMoreAnchorEl(null)}>Help Center</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
