import React from "react";
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 
import WaveformVis from "./WaveformVis";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
        <Header />
        <Outlet />
        <Footer />
        </>
    );
}