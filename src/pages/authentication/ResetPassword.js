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
import * as Yup from 'yup'
import { useFormik, FormikProvider } from 'formik'
import { useParams } from 'react-router'
import { useSnackbar } from 'notistack'
const SubmitButton = styled(Button)({
  width: '100%',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginBottom: '15px',
})
export default function ResetPassword() {
  const history = useHistory()
  const [disabled, setDisabled] = useState(false)
  const { activation_token } = useParams()
  const [msg, setMsg] = useState({ err: '', success: '' })
  const { enqueueSnackbar } = useSnackbar()
  const CreateAdminSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must at least 6 chacraters!')
      .max(50, 'Too Long!')
      .required('Password required'),
    confirmPassword: Yup.string()
      .min(6, 'Password must at least 6 chacraters!')
      .max(50, 'Too Long!')
      .required('Confirm password required'),
  })

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: CreateAdminSchema,
    onSubmit: async (values, { resetForm }) => {
      setDisabled(true)
      if (values.password != values.confirmPassword) {
        setMsg({ err: 'Confirm password not match', success: '' })
        return
      }
      try {
        const response = await axiosClient.post('/api/auth/reset-password', {
          password: values.password,
          activation_token,
        })

        if (response.data.success) {
          enqueueSnackbar(response.data.message, { variant: 'success' })
          setMsg({ err: '', success: response.data.message })
        }
        if (!response.data.success) {
          setMsg({ err: response.data.message, success: '' })
        }
        history.push('/login')
        resetForm()
      } catch (err) {
        setMsg({ err: err.response.data, success: '' })
      }

      setDisabled(false)
    },
  })
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik
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
            Reset password
          </Typography>
          {msg.success && showSuccessMsg(msg.success)}
          {msg.err && showErrMsg(msg.err)}
          <Grid
            container
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="New password"
                  name="password"
                  autoComplete="password"
                  type="password"
                  {...getFieldProps('password')}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirm password"
                  name="confirmPassword"
                  autoComplete="confirmPassword"
                  type="password"
                  {...getFieldProps('confirmPassword')}
                  error={Boolean(
                    touched.confirmPassword && errors.confirmPassword
                  )}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Grid>
            </Grid>
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formik.isValid || !formik.dirty}
            >
              Submit
            </SubmitButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Login page
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FormikProvider>
  )
}
