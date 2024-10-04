// src/pages/Layout.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
