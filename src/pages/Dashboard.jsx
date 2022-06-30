import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { Layout } from "../components/layout/index";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const handleDrawer = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex">
        <div>
          <Layout open={open} handleDrawer={handleDrawer} />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
