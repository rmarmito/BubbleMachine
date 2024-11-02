import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toolbar } from "@mui/material";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Toolbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
