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
import { styled } from '@mui/styles'
import axiosClient from '../../axiosClient'
import { useHistory, Link } from 'react-router-dom'
import { showSuccessMsg, showErrMsg } from '../../utils/Notifications'
import GoogleLogin from 'react-google-login'
import { useDispatch } from 'react-redux'
import { userLogin } from 'src/redux/userSlice'
import * as Yup from 'yup'
import { useFormik, FormikProvider } from 'formik'
import { useSnackbar } from 'notistack'
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
  const CreateAdminSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Username required'),
    password: Yup.string()
      .min(6, 'Password must at least 6 chacraters!')
      .max(50, 'Too Long!')
      .required('Password required'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: CreateAdminSchema,
    onSubmit: async (values, { resetForm }) => {
      setDisabled(true)
      try {
        const response = await axiosClient.post('/api/auth/login', {
          ...values,
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
    },
  })
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik
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
            Login
          </Typography>
          {msg.success && showSuccessMsg(msg.success)}
          {msg.err && showErrMsg(msg.err)}
          <Grid
            container
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="email"
              autoComplete="email"
              {...getFieldProps('username')}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
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
              {...getFieldProps('password')}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            <Grid container direction={'row'} justifyContent={'space-between'}>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
              <Grid item mt={1}>
                <Link to="/forgot-password">{'Forgot password?'}</Link>
              </Grid>
            </Grid>

            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            >
              Sign In
            </SubmitButton>
          </Grid>

          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENTID}
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
    </FormikProvider>
  )
}
