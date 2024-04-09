import React from "react";
import { Container, Grid, Typography} from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#f3f3f3", padding: "20px 0", position: 'fixed', bottom:0, width: '100%'  }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justify="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              The Bubble Machine
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              SDSU
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Other Prototypes
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" display="block" component={Link} to={"/"}>
              Waveform Visualizer
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" display="block" component={Link} to={"/Bubble"}>
              Bubble Maker
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;