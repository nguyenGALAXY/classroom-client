import Drawer from './Drawer/Drawer'
import React from 'react'
const Layout = ({ children }) => {
  return (
    <>
      <Drawer />
      <main>{children}</main>
    </>
  )
}

export default Layout
