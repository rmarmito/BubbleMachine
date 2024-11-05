import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../styles/context/ThemeContext";
import { appStyles } from "../../styles/context/LayoutStyles.jsx";

const Layout = () => {
  const { darkMode } = useTheme();

  return (
    <Box sx={appStyles.mainContainer(darkMode)}>
      <Header />
      <Box sx={appStyles.contentWrapper}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
