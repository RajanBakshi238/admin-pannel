import { useState } from "react";
import { useContext } from "react";
import SidebarContext from "../../context/sidebar/sidebarContext";

import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { AppBar } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { logoutInitiate } from "../../redux/actions";
import swal from "sweetalert";

const Appbar = () => {
  const { open, toggleSidebar } = useContext(SidebarContext);

  console.log(toggleSidebar);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin);

  const handleLogout = () => {
    swal({
      title: "Are you sure want to logout ? ",
      icon: "warning",
      buttons: ["cancel", "Logout"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        dispatch(logoutInitiate());
        swal("Your are logged Out Successfully !", {
          icon: "success",
        });
      }
    });
  };

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            edge="start"
            sx={{ flexGrow: 1, justifyContent: "flex-start" }}
          >
            <MenuIcon color="action" />
          </IconButton>

          <LoadingButton
            className="!bg-[#0f172a]"
            onClick={handleLogout}
            endIcon={<LogoutIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Logout
          </LoadingButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Appbar;

// onClick={() => dispatch(logoutInitiate())}
