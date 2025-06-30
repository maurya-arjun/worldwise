import React from "react";
import PageNav from "../components/PageNav";
import { Link } from "react-router-dom";
import AppNav from "../components/AppNav";

function Homepage() {
  return (
    <div>
      <PageNav />
      <AppNav />
      <h1>Welcome to WorldWise</h1>

      <Link to="/app">Go to the app</Link>
    </div>
  );
}

export default Homepage;
