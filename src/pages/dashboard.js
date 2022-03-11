import React, { useEffect } from "react";
import Header from "../components/header.js";
import Timeline from "../components/timeline.js";
import Sidebar from "../components/sidebar/index.js";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Instagram";
  }, []);
  return (
    <div className="bg-gray-100">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between m-auto max-w-screen-lg">
        <Timeline />
        <Sidebar />
      </div>
    </div>
  );
};

export default Dashboard;
