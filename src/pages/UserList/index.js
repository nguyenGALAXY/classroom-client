import React, { useEffect, useState } from 'react'
import axiosClient from 'src/axiosClient'
import { useParams, Redirect, useHistory } from 'react-router-dom'
import {
  Grid,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
} from '@mui/material'
import {
  AddSharp,
  ArrowBackIosNew,
  FileDownload,
  FileUpload,
} from '@mui/icons-material'
import partition from 'lodash/partition'
import ListUsers from './List/ListUsers'
import InviteModal from './InviteModal'
import Layout from '../../Layout/Layout'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { CSVLink } from 'react-csv'
import * as XLSX from 'xlsx'
import { useSnackbar } from 'notistack'

const headersCSV = [
  { label: 'studentId', key: 'User.studentId' },
  { label: 'fullName', key: 'fullName' },
]

const Header = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 24px;
  box-shadow: 0 6px 4px -4px rgb(0 0 0 / 20%);
`

const CSVrender = styled('div')``

const CustomCSVLink = styled(CSVLink)`
  margin-left: 20px;
  border-radius: 5px;
  border: 1px solid;
  padding: 10px;
  text-decoration: none;
  color: #000;
  display: flex;
`

const CustomLabel = styled('label')`
  margin-left: 20px;
  border-radius: 5px;
  border: 1px solid;
  padding: 10px;
  color: #000;
  display: flex;
`

const UserList = () => {
  const [users, setUsers] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [openInviteModal, setOpenInviteModal] = useState(false)
  const [role, setRole] = useState('')
  const { id } = useParams()
  const userRole = useSelector((state) => state.user.role)
  const history = useHistory()
  const [exportData, setExportData] = useState([])
  const [dataArr, setDataArr] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const fetchUserClassrooms = async () => {
      try {
        const response = await axiosClient.get(`/api/classrooms/${id}/users`)
        setUsers(response.data)
        const UserExport = response.data.filter(
          (user) => user.role === 'STUDENT'
        )
        setExportData(UserExport)
      } catch (error) {
        setErrorMsg(error.response.data.message)
      }
    }
    fetchUserClassrooms()
  }, [])
  const [students, teachers] = partition(users, (u) => u.role === 'STUDENT')

  const handleCloseInviteModal = () => {
    setOpenInviteModal(false)
  }

  const handleOpenInviteModal = (role) => {
    setRole(role)
    setOpenInviteModal(true)
  }

  const goBack = () => {
    history.goBack()
  }

  const addNewUser = (newUser) => {
    setUsers((prevState) => [...prevState, newUser])
  }

  const removeUser = (userId) => {
    setUsers((prevState) => prevState.filter((user) => user.userId !== userId))
  }

  const showButtonInvite = (nameButton, role) => {
    return (
      <Button onClick={() => handleOpenInviteModal(role)}>
        {nameButton} <AddSharp />
      </Button>
    )
  }

  const userData = exportData
    .filter((user) => _.get(user, 'User.studentId', ''))
    .map((user) => _.pick(user, ['User.studentId', 'fullName']))

  const userId = exportData.map((user) => _.pick(user, ['User.id']))

  for (let i = 0; i < userId.length; i++) {
    userId[i].id = userId[i]['User.id']
    delete userId[i]['User.id']
  }

  for (let i = 0; i < userId.length; i++) {
    _.extend(dataArr[i], userId[i])
  }

  const updateUserImport = async (data) => {
    try {
      const response = await axiosClient.post(`/api/classrooms/${id}/upload`, {
        data,
      })
      enqueueSnackbar(response.data.message, { variant: 'success' })
    } catch (error) {
      console.log(error)
    }
  }

  const csvReport = {
    data: userData,
    headers: headersCSV,
    filename: 'ClassroomUser',
  }

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        const bufferArray = e.target.result
        const wb = XLSX.read(bufferArray, { type: 'buffer' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)
        resolve(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    return promise
  }

  const RenderCSVReader = () => {
    return (
      <CSVrender>
        <CustomLabel>
          <input
            style={{ display: 'none' }}
            type="file"
            onChange={async (e) => {
              const file = e.target.files[0]
              const uploadedData = await readExcel(file)
              updateUserImport(uploadedData)
            }}
          />
          <FileUpload />
          <span>Import Data</span>
        </CustomLabel>
      </CSVrender>
    )
  }

  const renderTeachersList = () => {
    return (
      <Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
            Teacher
          </Typography>

          {userRole === 'TEACHER' &&
            showButtonInvite('Invite TEACHER ', 'TEACHER')}
        </Box>

        <InviteModal
          open={openInviteModal}
          handleClose={handleCloseInviteModal}
          classroomId={id}
          role={role}
          addNewUser={addNewUser}
        />
        <ListUsers users={teachers} removeUser={removeUser} />
      </Grid>
    )
  }

  const renderExcelFile = () => {
    return (
      <CustomCSVLink {...csvReport}>
        <FileDownload />
        Export Data
      </CustomCSVLink>
    )
  }

  const renderImportExport = () => {
    return (
      <>
        {renderExcelFile()}
        {RenderCSVReader()}
      </>
    )
  }
  const renderStudentsList = () => {
    return (
      <Grid sx={{ flexGrow: 1, maxWidth: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
            Student
          </Typography>
          {userRole === 'TEACHER' &&
            showButtonInvite('Invite STUDENT ', 'STUDENT')}
        </Box>

        <InviteModal
          open={openInviteModal}
          handleClose={handleCloseInviteModal}
          classroomId={id}
          role={role}
          addNewUser={addNewUser}
        />
        <ListUsers users={students} removeUser={removeUser} />
      </Grid>
    )
  }
  return (
    <>
      <Layout />
      {errorMsg ? (
        <Redirect to="/" />
      ) : (
        <Container maxWidth="lg" spacing={2}>
          <Header>
            <IconButton onClick={goBack}>
              <ArrowBackIosNew />
            </IconButton>
            <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
              List Users
            </Typography>
            {userRole === 'TEACHER' && renderImportExport()}
          </Header>
          {renderTeachersList()}
          {renderStudentsList()}
        </Container>
      )}
    </>
  )
}

export default UserList
