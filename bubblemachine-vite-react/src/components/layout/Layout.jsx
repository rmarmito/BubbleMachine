// src/pages/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      {/* Navigation menu (if not included in Header) */}
      <nav></nav>
      <Outlet />
      <Footer />
    </>
  );
}
