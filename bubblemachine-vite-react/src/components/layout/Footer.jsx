import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #e9ecef",
        mt: "auto",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
              BubbleMachine
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Creating innovative audio visualizations and analysis tools for
              the modern web.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Grid container spacing={1}>
              {["Documentation", "Tutorials", "API Reference", "Support"].map(
                (link) => (
                  <Grid item xs={6} key={link}>
                    <Button
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          color: "primary.main",
                          transform: "translateX(5px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {link}
                    </Button>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Connect With Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <GitHubIcon />, label: "GitHub" },
                { icon: <LinkedInIcon />, label: "LinkedIn" },
                { icon: <TwitterIcon />, label: "Twitter" },
                { icon: <EmailIcon />, label: "Email" },
              ].map((social) => (
                <Tooltip key={social.label} title={social.label}>
                  <IconButton
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "primary.main",
                        transform: "translateY(-3px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid #e9ecef",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} BubbleMachine. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
