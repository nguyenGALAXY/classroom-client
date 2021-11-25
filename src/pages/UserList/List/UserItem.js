import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  ListItem,
  ListItemAvatar,
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import styled from '@emotion/styled'
import get from 'lodash/get'
import { showErrMsg } from 'src/utils/Notifications'
import axiosClient from 'src/axiosClient'

const StatusText = styled('p')`
  text-transform: lowercase;
  margin-left: 20px;
  color: #c8c6c6;
`

const UserItem = ({ user, removeUser }) => {
  const [open, setOpen] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const userRole = useSelector((state) => state.user.role)
  const userState = useSelector((state) => state.user.user)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const deleteUser = async (user) => {
    try {
      await axiosClient.post(
        `/api/classrooms/${user.classroomId}/remove-user`,
        {
          userId: user.userId,
        }
      )
      removeUser(user.userId)
      handleClose()
    } catch (error) {
      const errorMsg = get(error, 'response.data.message', 'Error')
      setErrMsg(errorMsg)
    }
  }

  const renderDeleteButton = () => {
    return (
      userRole === 'TEACHER' &&
      user.userId !== userState.id && (
        <IconButton onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
      )
    )
  }

  return (
    <>
      <ListItem
        key={user.id}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex' }}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <p>{get(user, 'User.username')}</p>
          {user.status === 'PENDING' && (
            <StatusText>({user.status})</StatusText>
          )}
        </Box>
        {renderDeleteButton()}
      </ListItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {`Remove user ${get(user, 'User.username', '')} from classroom`}
        </DialogTitle>
        {errMsg && showErrMsg(errMsg)}
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteUser(user)}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserItem
