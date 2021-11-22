import React, { useState } from 'react'
import {
  AppBar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Button,
} from '@mui/material'
import { Add, Apps } from '@mui/icons-material'
import CreateClass from '../classroom/components/CreateClass/CreateClass'
import JoinClass from '../classroom/components/JoinClass/JoinClass'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from 'src/redux/userSlice'
import accountDefault from 'src/_mocks_/account'

const HeaderWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})
const HeaderWrapperRight = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
const MyAppBar = styled(AppBar)({
  backgroundColor: '#ffffff',
  color: 'black',
})
const MyAvatar = styled(Avatar)({
  color: '#5f656d',
  cursor: 'pointer',
})
const MyApps = styled(Apps)({
  marginRight: '15px',
  color: '#5f656d',
  cursor: 'pointer',
})
const MyAdd = styled(Add)({
  marginRight: '15px',
  color: '#5f656d',
  cursor: 'pointer',
})
const Header = ({ children }) => {
  //const [anchorEl, setAnchorEl] = useState(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const [anchorElClassroom, setAnchorElClassroom] = useState(null)
  const [anchorElProfile, setAnchorElProfile] = useState(null)
  const handleClick = (event) => {
    setAnchorElClassroom(event.currentTarget)
  }
  const handleCloseClassroomMenu = () => {
    setAnchorElClassroom(null)
  }
  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null)
  }
  const handleMenuProfile = (event) => {
    setAnchorElProfile(event.currentTarget)
  }
  const handleProfile = () => {
    history.push('/profile')
    handleCloseProfileMenu()
  }
  const [createClassDialog, setCreateClassDialog] = useState(false)
  const [joinClassDialog, setJoinClassDialog] = useState(false)
  const handleCreate = () => {
    handleCloseClassroomMenu()
    setCreateClassDialog(true)
  }
  const handleJoin = () => {
    handleCloseClassroomMenu()
    setJoinClassDialog(true)
  }
  const handleLogout = () => {
    localStorage.clear()
    history.push('/login')
    dispatch(userLogout())
  }
  const handleReturnHomepage = () => {
    history.push('/')
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MyAppBar position="static">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <HeaderWrapper>
            {children}
            <Button onClick={handleReturnHomepage}>
              <Avatar src="/book-stack.png" sx="mr: 2px" />
              <Typography ml={1} variant="h6">
                My Classroom
              </Typography>
            </Button>
          </HeaderWrapper>
          <HeaderWrapperRight>
            <MyAdd onClick={handleClick} />
            {/* <MyApps /> */}
            <Menu
              id="simple-menu"
              anchorEl={anchorElClassroom}
              keepMounted
              open={Boolean(anchorElClassroom)}
              onClose={handleCloseClassroomMenu}
            >
              <MenuItem onClick={handleJoin}>Join class</MenuItem>
              <MenuItem onClick={handleCreate}>Create class</MenuItem>
            </Menu>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuProfile}
              color="inherit"
            >
              <MyAvatar
                src={user.picture ? user.picture : accountDefault.photoURL}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElProfile}
              keepMounted
              open={Boolean(anchorElProfile)}
              onClose={handleCloseProfileMenu}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </HeaderWrapperRight>
        </Toolbar>
      </MyAppBar>
      <CreateClass
        createClassDialog={createClassDialog}
        setCreateClassDialog={setCreateClassDialog}
      />
      <JoinClass
        joinClassDialog={joinClassDialog}
        setJoinClassDialog={setJoinClassDialog}
      />
    </Box>
  )
}

export default Header
