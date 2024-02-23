import React from "react";
import { Toolbar } from "@mui/material";
import { AppBar } from "@mui/material";
import { Typography } from "@mui/material";

const Header = () => {
  return (
    <Toolbar>
      <AppBar>
        <Typography variant="h3" align="center">
          BubbleMachine Header Test
        </Typography>
      </AppBar>
    </Toolbar>
  );
};

export default Header;
