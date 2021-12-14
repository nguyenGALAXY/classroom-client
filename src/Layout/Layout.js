import Drawer from './Drawer/Drawer'
import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
const theme = createTheme()
const Layout = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Drawer />
        <main>{children}</main>
      </ThemeProvider>
    </>
  )
}

export default Layout
