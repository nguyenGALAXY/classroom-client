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
const SubmitButton = styled(Button)({
  width: '100%',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginBottom: '15px',
})
export default function ForgotPassword() {
  const history = useHistory()
  const [disabled, setDisabled] = useState(false)
  const [msg, setMsg] = useState({ err: '', success: '' })
  const CreateAdminSchema = Yup.object().shape({
    email: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .email('Invalid email address')
      .required('Email required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: CreateAdminSchema,
    onSubmit: async (values, { resetForm }) => {
      setDisabled(true)
      try {
        const response = await axiosClient.post('/api/auth/forgot-password', {
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
          <Typography component="h1" variant="h4">
            Forgot password
          </Typography>
          <Typography component="h1" variant="h6">
            Enter your email address
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
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
