import React from 'react'
import Appbar from './Appbar'
import Sidebar from './Sidebar'

export const Layout = ({open, handleDrawer}) => {
  return (
    <>
        <Appbar open={open} handleDrawer={handleDrawer} />
        <Sidebar open={open}/>
    </>
    )
}
