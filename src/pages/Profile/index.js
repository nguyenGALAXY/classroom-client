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
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { styled } from '@mui/styles'
import Layout from '../../Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, updateUser } from 'src/redux/userSlice'
import { showErrMsg } from '../../utils/Notifications'
import accountDefault from 'src/_mocks_/account'
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

const theme = createTheme()
export default function Profile() {
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
  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    dispatch(
      updateUser({
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        phone: data.get('phone'),
        studentId: data.get('studentId'),
      })
    )
    setIsEdit(false)
    setInputDisabled(true)
  }
  const showButtonEdit = () => {
    return (
      <Button onClick={handleEdit} variant="contained">
        Edit Profile
      </Button>
    )
  }
  const showTextInput = (field, value) => {
    return (
      <TextField
        id={field}
        name={field}
        fullWidth
        variant="standard"
        defaultValue={value}
      ></TextField>
    )
  }
  return (
    <Layout>
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
            <Button disabled={inputDisabled} type="submit" variant="contained">
              Save changes
            </Button>
          </MyBox>
        </Container>
      </ThemeProvider>
    </Layout>
  )
}
