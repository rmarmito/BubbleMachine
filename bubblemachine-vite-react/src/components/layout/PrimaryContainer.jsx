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
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  InfoOutlined as InfoOutlinedIcon,
  AudioFile as AudioFileIcon,
} from "@mui/icons-material";
import { useTheme } from "../../styles/context/ThemeContext.jsx";
import { containerStyles } from "../../styles/context/LayoutStyles.jsx";

const LoadingAnimation = () => (
  <Box sx={containerStyles.loadingAnimation}>
    {[...Array(5)].map((_, index) => (
      <Box
        key={index}
        className="bar"
        sx={{ animationDelay: `${index * 0.1}s` }}
      />
    ))}
  </Box>
);

const AudioFileName = ({ fileName }) => {
  if (!fileName) return "No file selected";

  const parts = fileName.split(".");
  const extension = parts.pop();
  const name = parts.join(".");

  return (
    <Box sx={containerStyles.audioFileName}>
      <AudioFileIcon className="icon" />
      <Typography className="name">
        {name}
        <Typography component="span" className="extension">
          .{extension}
        </Typography>
      </Typography>
    </Box>
  );
};

const PrimaryContainer = ({
  title,
  subheader,
  actions,
  children,
  defaultMinimized = false,
  info,
  isAudioFile = false,
  isLoading = false,
}) => {
  const { darkMode } = useTheme();
  const [expanded, setExpanded] = useState(!defaultMinimized);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={containerStyles.paper(darkMode, isHovered)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading && (
        <Fade in={isLoading}>
          <Box sx={containerStyles.loadingOverlay}>
            <LoadingAnimation />
          </Box>
        </Fade>
      )}

      <Box sx={containerStyles.header}>
        <Box sx={containerStyles.headerTitle}>
          {isAudioFile ? (
            <AudioFileName fileName={title} />
          ) : (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
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

        <Box sx={containerStyles.headerActions}>
          {actions}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={containerStyles.expandButton}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded} timeout={300}>
        <Box sx={containerStyles.content}>{children}</Box>
      </Collapse>
    </Paper>
  );
};

export default PrimaryContainer;
