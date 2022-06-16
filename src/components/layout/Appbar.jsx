import {useState} from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from "@mui/material/IconButton";
import LoadingButton from '@mui/lab/LoadingButton';
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { AppBar } from "../utils";
import { useDispatch, useSelector } from 'react-redux';
import {logoutInitiate} from '../../redux/actions'


const Appbar = ({ open, handleDrawer }) => {
  
  
  const dispatch = useDispatch()
  const { loading} = useSelector(state => state.admin)

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{ flexGrow: 1 , justifyContent: 'flex-start'}}
          >
            <MenuIcon color="action" />
          </IconButton>

          <LoadingButton
            className='!bg-[#0f172a]'
            onClick={() => dispatch(logoutInitiate())}
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
