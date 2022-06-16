import React, {useState} from "react";
import {Outlet } from 'react-router-dom'

// import Sidebar from "../components/Dashboard/layout/Sidebar"
// import Appbar from "../components/Dashboard/layout/Appbar";
import {Layout} from '../components/layout/index'

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

                {/* <Appbar open={open} handleDrawer={handleDrawer}/>
                <Sidebar open={open} /> */}
            </div>
            <Outlet />
        </div>
        </>  
    )
}

export default Dashboard