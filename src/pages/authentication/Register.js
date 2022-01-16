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
import * as Yup from 'yup'
import { useFormik, FormikProvider } from 'formik'
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
  const CreateAdminSchema = Yup.object().shape({
    email: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .email('Invalid email address')
      .required('Email required'),
    username: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Username required'),
    password: Yup.string()
      .min(6, 'Password must at least 6 chacraters!')
      .max(50, 'Too Long!')
      .required('Password required'),
    firstName: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!'),
    lastName: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
    },
    validationSchema: CreateAdminSchema,
    onSubmit: async (values, { resetForm }) => {
      setDisabled(true)
      try {
        const response = await axiosClient.post('/api/auth/register', {
          ...values,
        })

        if (response.data.success) {
          setMsg({ err: '', success: response.data.message })
        }
        if (!response.data.success) {
          setMsg({ err: response.data.message, success: '' })
        }
        resetForm()
      } catch (err) {
        err.response.data.message &&
          setMsg({ err: err.response.data.message, success: '' })
      }

      setDisabled(false)
    },
  })
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik
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
    <FormikProvider value={formik}>
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
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  {...getFieldProps('firstName')}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
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
                  {...getFieldProps('lastName')}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
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
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  {...getFieldProps('username')}
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
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
                  {...getFieldProps('password')}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid>
            </Grid>
            <RegisterButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formik.isValid || !formik.dirty}
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
    </FormikProvider>
  )
}
