import React, { useState } from 'react'
import {
  AppBar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import CreateClass from '../../components/CreateClass/CreateClass'
import JoinClass from '../../components/JoinClass/JoinClass'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import AccountPopover from './AccountPopover'
import NotificationPopover from './NotificationPopover'

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
const MyAdd = styled(Add)({
  marginRight: '15px',
  color: '#5f656d',
  cursor: 'pointer',
})

const Header = ({ children }) => {
  const history = useHistory()
  const [anchorElClassroom, setAnchorElClassroom] = useState(null)

  const handleClick = (event) => {
    setAnchorElClassroom(event.currentTarget)
  }

  const handleCloseClassroomMenu = () => {
    setAnchorElClassroom(null)
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
            <NotificationPopover />
            <MyAdd onClick={handleClick} />
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
            <AccountPopover />
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
