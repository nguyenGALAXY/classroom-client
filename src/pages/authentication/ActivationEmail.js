import React, { useState, useEffect } from 'react'
import { Avatar, Button, Box, Typography, Container } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import axiosClient from '../../axiosClient'
import { showSuccessMsg, showErrMsg } from '../../utils/Notifications'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
export default function ActivationEmail() {
  const history = useHistory()
  const { activation_token } = useParams()
  const [msg, setMsg] = useState({ err: '', success: '' })
  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const response = await axiosClient.post('/api/auth/activate-email', {
            activation_token,
          })
          if (response.data.success) {
            setMsg({ err: '', success: response.data.message })
          }
          if (!response.data.success) {
            setMsg({ err: response.data.message, success: '' })
          }
        } catch (err) {
          err.response.data.message &&
            setMsg({ err: err.response.data.message, success: '' })
        }
      }
      activationEmail()
    }
  }, [activation_token])
  const handleGoBackLogin = (e) => {
    e.preventDefault()
    history.push('/login')
  }
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Verify New Account
        </Typography>
        {msg.success && showSuccessMsg(msg.success)}
        {msg.err && showErrMsg(msg.err)}
        <Button
          onClick={handleGoBackLogin}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Go back login
        </Button>
      </Box>
    </Container>
  )
}
