import {
  AppBar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  ListItemIcon,
} from '@mui/material'
import React from 'react'
import { useStyles } from './style'
import { Add, Apps, Logout } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import { useState } from 'react'
import CreateClass from '../classroom/components/CreateClass/CreateClass'
import JoinClass from '../classroom/components/JoinClass/JoinClass'
import { useHistory } from 'react-router'
const Header = ({ children }) => {
  const classes = useStyles()
  const history = useHistory()
  //handle toggle
  const [anchorElClass, setAnchorElClass] = useState(null)
  const [anchorElProfile, setAnchorElProfile] = useState(null)
  const handleClickClass = (event) => {
    setAnchorElClass(event.currentTarget)
  }
  const handleCloseClass = () => {
    setAnchorElClass(null)
  }
  const handleClickProfile = (event) => {
    setAnchorElProfile(event.currentTarget)
  }
  const handleCloseProfile = () => {
    setAnchorElProfile(null)
  }
  const [createClassDialog, setCreateClassDialog] = useState(false)
  const [joinClassDialog, setJoinClassDialog] = useState(false)
  const handleCreate = () => {
    handleCloseClass()
    setCreateClassDialog(true)
  }
  const handleJoin = () => {
    handleCloseClass()
    setJoinClassDialog(true)
  }
  const logout = () => {
    localStorage.clear()
    history.push('/login')
  }
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.headerWrapper}>
            {children}
            <img
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
              alt="Classroom"
            />
            <Typography variant="h6" className={classes.title}>
              Classroom
            </Typography>
          </div>
          <div className={classes.header_wrapper_right}>
            <Add className={classes.icon} onClick={handleClickClass} />
            <Apps className={classes.icon} />
            <Menu
              id="simple-menu"
              anchorEl={anchorElClass}
              keepMounted
              open={Boolean(anchorElClass)}
              onClose={handleCloseClass}
            >
              <MenuItem onClick={handleJoin}>Join class</MenuItem>
              <MenuItem onClick={handleCreate}>Create class</MenuItem>
            </Menu>
            <div>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClickProfile}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElProfile}
                open={Boolean(anchorElProfile)}
                onClose={handleCloseProfile}
                onClick={handleCloseProfile}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
                <MenuItem>
                  <Avatar /> My account
                </MenuItem>

                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <CreateClass
        createClassDialog={createClassDialog}
        setCreateClassDialog={setCreateClassDialog}
      />
      <JoinClass
        joinClassDialog={joinClassDialog}
        setJoinClassDialog={setJoinClassDialog}
      />
    </div>
  )
}

export default Header
