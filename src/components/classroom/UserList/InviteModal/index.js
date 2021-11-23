import React, { useState } from 'react'
import { Modal, Grid, Typography, TextField, Button } from '@mui/material'
import axiosClient from 'src/axiosClient'
import { showErrMsg } from 'src/utils/Notifications'
import { isEmail } from 'src/utils/Validation'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
}

const InviteModal = ({ open, handleClose, classroomId, role, addNewUser }) => {
  const [email, setEmail] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [disabled, setDisabled] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) {
      setErrMsg('Invalid email')
    } else {
      setDisabled(true)
      try {
        const response = await axiosClient.post(
          `/api/classrooms/${classroomId}/invite`,
          {
            email,
            role,
          }
        )
        const { newUser } = response.data
        addNewUser(newUser)
        setEmail('')
        handleClose()
      } catch (error) {
        setErrMsg(error.response.data.message)
      }
      setDisabled(false)
    }
  }

  const handleEmailChange = (e) => {
    setErrMsg('')
    setEmail(e.target.value)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid sx={style} container onSubmit={handleSubmit} component="form">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mr: 'auto', mb: 1, width: '100%' }}
          >
            Invite {role}
          </Typography>

          {errMsg && showErrMsg(errMsg)}

          <TextField
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={handleEmailChange}
            label="user email"
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, ml: 'auto' }}
            disabled={disabled}
          >
            Invite
          </Button>
        </Grid>
      </Modal>
    </div>
  )
}

export default InviteModal
