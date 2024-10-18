import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const PrimaryContainer = ({
  title,
  subheader,
  actions,
  children,
  defaultMinimized = false,
}) => {
  const [expanded, setExpanded] = useState(!defaultMinimized);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Card variant="outlined" sx={{ margin: 2, borderRadius: 2 }}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <>
            {actions}
            <IconButton onClick={handleExpandClick}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </>
        }
        sx={{ backgroundColor: "primary.main", color: "white" }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
        <CardContent>{children}</CardContent>
      </Collapse>
    </Card>
  );
};

export default PrimaryContainer;
