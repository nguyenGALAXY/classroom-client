import React, { useState } from 'react'
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material'
import { styled } from '@mui/styles'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import axiosClient from '../../axiosClient'
import { useHistory, Link } from 'react-router-dom'
import { showSuccessMsg, showErrMsg } from '../../utils/Notifications'
import { isEmail } from '../../utils/Validation'
import GoogleLogin from 'react-google-login'
import GoogleIcon from '@mui/icons-material/Google'
const GoogleButton = styled(Button)({
  width: '100%',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginBottom: '15px',
})
const RegisterButton = styled(Button)({
  width: '100%',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginBottom: '15px',
})
export default function Register() {
  const history = useHistory()
  const [disabled, setDisabled] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [msg, setMsg] = useState({ err: '', success: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setDisabled(true)
    setEmailError(false)
    setUsernameError(false)
    setPasswordError(false)
    const data = new FormData(event.currentTarget)
    //check email valid
    if (!isEmail(data.get('email'))) {
      setMsg({ err: 'Invalid email', success: '' })
    }
    //check email,username,password empty
    if (data.get('email') === '') {
      setEmailError(true)
    }
    if (data.get('username') === '') {
      setUsernameError(true)
    }
    if (data.get('password') === '') {
      setPasswordError(true)
    }
    if (data.get('email') && data.get('username') && data.get('password')) {
      try {
        const response = await axiosClient.post('/api/auth/register', {
          email: data.get('email'),
          username: data.get('username'),
          password: data.get('password'),
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
    setDisabled(false)
  }
  const responseGoogle = async (response) => {
    try {
      const res = await axiosClient.post('/api/auth/google-signup', {
        tokenId: response.tokenId,
      })
      if (res.data.success) {
        setMsg({ err: '', success: res.data.message })
        history.push(`/activateEmail/${res.data.activation_token}`)
      }
      if (!res.data.success) {
        console.log(res.data)
        setMsg({ err: res.data.message, success: '' })
      }
    } catch (err) {
      console.log(err.response)
      err.response.data.message &&
        setMsg({ err: err.response.data.message, success: '' })
    }
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
          Register New Account
        </Typography>
        {msg.success && showSuccessMsg(msg.success)}
        {msg.err && showErrMsg(msg.err)}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                error={usernameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                error={passwordError}
              />
            </Grid>
          </Grid>
          <RegisterButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={disabled}
          >
            Register
          </RegisterButton>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENTID}
            buttonText="Login with Google"
            render={(renderProps) => (
              <GoogleButton
                onClick={renderProps.onClick}
                startIcon={<GoogleIcon />}
              >
                Sign up with google
              </GoogleButton>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
