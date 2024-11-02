import { useState } from "react";
import {
  Paper,
  IconButton,
  Collapse,
  Typography,
  Box,
  Fade,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const PrimaryContainer = ({
  title,
  subheader,
  actions,
  children,
  defaultMinimized = false,
  info, // Optional info tooltip text
}) => {
  const [expanded, setExpanded] = useState(!defaultMinimized);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={isHovered ? 3 : 1}
      sx={{
        margin: 2,
        borderRadius: 2,
        transition: "all 0.3s ease",
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.12)",
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          padding: "12px 16px",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {info && (
            <Tooltip title={info}>
              <InfoOutlinedIcon sx={{ fontSize: 20, opacity: 0.7 }} />
            </Tooltip>
          )}
          {subheader && (
            <Typography variant="body2" sx={{ opacity: 0.8, ml: 2 }}>
              {subheader}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {actions}
          <Tooltip title={expanded ? "Collapse" : "Expand"}>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                color: "white",
                transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: expanded
                    ? "rotate(180deg) scale(1.1)"
                    : "rotate(0deg) scale(1.1)",
                },
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Collapse in={expanded} timeout={300}>
        <Fade in={expanded} timeout={500}>
          <Box
            sx={{
              p: 3,
              backgroundColor: isHovered
                ? "rgba(0, 0, 0, 0.01)"
                : "transparent",
              transition: "background-color 0.3s ease",
            }}
          >
            {children}
          </Box>
        </Fade>
      </Collapse>
    </Paper>
  );
};

export default PrimaryContainer;
