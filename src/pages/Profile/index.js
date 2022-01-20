import React, { useState, useEffect } from 'react'
import {
  CssBaseline,
  Box,
  Container,
  Avatar,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
} from '@mui/material'
import { styled } from '@mui/styles'
import Layout from '../../Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, updateUser } from 'src/redux/userSlice'
import { showErrMsg } from '../../utils/Notifications'
import accountDefault from 'src/_mocks_/account'
import * as Yup from 'yup'
import { useFormik, FormikProvider } from 'formik'
import { useSnackbar } from 'notistack'
import get from 'lodash/get'
import { LoadingButton } from '@mui/lab'
const MyBox = styled(Box)({
  borderRadius: 3,
  boxShadow: '#091e42 0px 1px 1px 0px',
  color: '#172b4d',
  padding: '20px 16px',
  marginBottom: '15px',
  lineHeight: '20px',
  fontSize: '14px',
})
const LabelBox = styled(Typography)({
  color: '#172b4d',
  fontWeight: '600',
  letterSpacing: '-0.096px',
})
const InputBox = styled(Box)({
  display: 'flex',
  lineHeight: '20px',
  padding: '10px 16px',
  width: '100%',
})
const LabelInput = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  color: '#6b778c',
  fontWeight: '600',
}))
const WrapInforInput = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  color: '#172b4d',
}))

export default function Profile() {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.user)
  const user = useSelector((state) => state.user.user)
  const [isEdit, setIsEdit] = useState(false)
  const [inputDisabled, setInputDisabled] = useState(true)

  useEffect(() => {
    async function fetchAPI() {
      dispatch(fetchUser())
    }
    fetchAPI()
  }, [auth.isLogged, dispatch])

  const handleEdit = () => {
    setIsEdit(true)
    setInputDisabled(false)
  }

  const showButtonEdit = () => {
    return (
      <Button onClick={handleEdit} variant="contained">
        Edit Profile
      </Button>
    )
  }

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().max(50, 'Too Long!'),
    lastName: Yup.string().max(50, 'Too Long!'),
    phone: Yup.string().max(15, 'Too Long'),
  })
  const formik = useFormik({
    initialValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      studentId: user.studentId || '',
    },
    enableReinitialize: true,
    validationSchema: ProfileSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(updateUser({ ...values })).unwrap()
        enqueueSnackbar('edit profile Success.', { variant: 'success' })
        setIsEdit(false)
        setInputDisabled(true)
        resetForm()
      } catch (error) {
        enqueueSnackbar(error, { variant: 'error' })
      }
    },
  })

  const { handleSubmit, getFieldProps, errors, touched, isSubmitting } = formik
  const showTextInput = (field, value) => {
    return (
      <TextField
        id={field}
        name={field}
        fullWidth
        variant="standard"
        {...getFieldProps(field)}
        error={Boolean(touched[field] && errors[field])}
        helperText={touched[field] && errors[field]}
      ></TextField>
    )
  }
  return (
    <Layout>
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
            <Avatar
              sx={{ width: 120, height: 120 }}
              src={user.picture ? user.picture : accountDefault.photoURL}
            ></Avatar>
            <Typography component="h1" variant="h5" mt={2}>
              Profile
            </Typography>
          </Box>
          {auth.message && showErrMsg(auth.message)}
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            alignItems="center"
          >
            {/* Label Information */}
            <Grid item>
              <LabelBox component="h1" variant="h5" mt={2}>
                Information
              </LabelBox>
            </Grid>
            <Grid item>{isEdit === false && showButtonEdit()}</Grid>
          </Grid>

          <MyBox
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Input first name */}
            <InputBox>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <LabelInput elevation={0}>First Name</LabelInput>
                </Grid>
                <Grid item xs={8}>
                  <WrapInforInput elevation={0}>
                    {isEdit
                      ? showTextInput('firstName', user.firstName)
                      : user.firstName}
                  </WrapInforInput>
                </Grid>
              </Grid>
            </InputBox>
            {/* Input last name */}
            <InputBox>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <LabelInput elevation={0}>Last Name</LabelInput>
                </Grid>
                <Grid item xs={8}>
                  <WrapInforInput elevation={0}>
                    {isEdit
                      ? showTextInput('lastName', user.lastName)
                      : user.lastName}
                  </WrapInforInput>
                </Grid>
              </Grid>
            </InputBox>
            {/* Input username */}
            <InputBox>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <LabelInput elevation={0}>Username</LabelInput>
                </Grid>
                <Grid item xs={8}>
                  <WrapInforInput elevation={0}>{user.username}</WrapInforInput>
                </Grid>
              </Grid>
            </InputBox>
            {/* Input student ID */}
            <InputBox>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <LabelInput elevation={0}>Student ID</LabelInput>
                </Grid>
                <Grid item xs={8}>
                  <WrapInforInput elevation={0}>
                    {isEdit
                      ? showTextInput('studentId', user.studentId)
                      : user.studentId}
                  </WrapInforInput>
                </Grid>
              </Grid>
            </InputBox>
            {/* Input Phone number */}
            <InputBox>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <LabelInput elevation={0}>Phone Number</LabelInput>
                </Grid>
                <Grid item xs={8}>
                  <WrapInforInput elevation={0}>
                    {isEdit ? showTextInput('phone', user.phone) : user.phone}
                  </WrapInforInput>
                </Grid>
              </Grid>
            </InputBox>
            {/* Input Email */}
            <InputBox>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <LabelInput elevation={0}>Email</LabelInput>
                </Grid>
                <Grid item xs={8}>
                  <WrapInforInput elevation={0}>{user.email}</WrapInforInput>
                </Grid>
              </Grid>
            </InputBox>
            <LoadingButton
              size="medium"
              disabled={!formik.isValid || !formik.dirty}
              loading={isSubmitting}
              type="submit"
              variant="contained"
            >
              Save Change
            </LoadingButton>
          </MyBox>
        </Container>
      </FormikProvider>
    </Layout>
  )
}
