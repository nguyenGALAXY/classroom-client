import React, { useState } from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Grid,
  Typography,
  Container,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { styled } from '@mui/styles'
import axiosClient from '../../axiosClient'
import { useHistory, Link } from 'react-router-dom'
import { showSuccessMsg, showErrMsg } from '../utils/Notifications'
import GoogleLogin from 'react-google-login'
import { useDispatch } from 'react-redux'
import { userLogin } from 'src/redux/userSlice'
const theme = createTheme()
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
const SubmitButton = styled(Button)({
  width: '100%',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginBottom: '15px',
})
export default function SignIn() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(false)
  const [msg, setMsg] = useState({ err: '', success: '' })

  const isAuthenticated = !!localStorage.getItem('token')
  if (isAuthenticated) {
    history.push('/home')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setDisabled(true)
    const data = new FormData(event.currentTarget)
    try {
      const response = await axiosClient.post('/api/auth/login', {
        username: data.get('email'),
        password: data.get('password'),
      })
      if (response.data.success) {
        setMsg({ err: '', success: response.data.message })
        localStorage.setItem('token', response.data.token)

        axiosClient.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${localStorage.getItem('token')}`

        const { user } = response.data
        dispatch(userLogin(user))
        history.push('/home')
      }
      if (!response.data.success) {
        setMsg({ err: response.data.message, success: '' })
      }
    } catch (err) {
      err.response.data.message &&
        setMsg({ err: err.response.data.message, success: '' })
    }
    setDisabled(false)
  }
  const responseGoogle = async (response) => {
    try {
      const res = await axiosClient.post('/api/auth/google-login', {
        tokenId: response.tokenId,
      })
      if (res.data.success) {
        setMsg({ err: '', success: res.data.message })
        localStorage.setItem('token', res.data.token)

        axiosClient.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${localStorage.getItem('token')}`

        const user = res.data.userData
        dispatch(userLogin(user))
        history.push('/home')
      }
      if (!res.data.success) {
        setMsg({ err: res.data.message, success: '' })
      }
    } catch (err) {
      err.response.data.message &&
        setMsg({ err: err.response.data.message, success: '' })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
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
            Login
          </Typography>
          {msg.success && showSuccessMsg(msg.success)}
          {msg.err && showErrMsg(msg.err)}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={disabled}
            >
              Sign In
            </SubmitButton>
          </Box>

          <GoogleLogin
            clientId="358036581199-d9odgr20b7jarvkv1falnsbq20cu2mt2.apps.googleusercontent.com"
            buttonText="Login with Google"
            render={(renderProps) => (
              <GoogleButton
                onClick={renderProps.onClick}
                startIcon={<GoogleIcon />}
              >
                Sign In with google
              </GoogleButton>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Link to="/register">{'Dont have an account? Sign up'}</Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
