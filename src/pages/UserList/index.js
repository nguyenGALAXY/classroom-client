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
import { AddSharp, ArrowBackIosNew } from '@mui/icons-material'
import partition from 'lodash/partition'
import ListUsers from './List/ListUsers'
import InviteModal from './InviteModal'
import Layout from '../../Layout/Layout'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { CSVLink } from 'react-csv'
import * as XLSX from 'xlsx'

const headersCSV = [
  { label: 'firstName', key: 'User.firstName' },
  { label: 'lastName', key: 'User.lastName' },
  { label: 'email', key: 'User.email' },
  { label: 'studentId', key: 'User.studentId' },
]

const Header = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 24px;
  box-shadow: 0 6px 4px -4px rgb(0 0 0 / 20%);
`
const CSVrender = styled('div')`
  margin-left: 10px;
  padding: 10px;
  border-radius: 10px;
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
  useEffect(() => {
    const fetchUserClassrooms = async () => {
      try {
        const response = await axiosClient.get(`/api/classrooms/${id}/users`)
        setUsers(response.data)
        const UserExport = response.data.filter(
          (user) => user.role === 'STUDENT'
        )
        setExportData(UserExport)
        updateUserImport()
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

  const userData = exportData.map((user) =>
    _.pick(user, [
      'User.firstName',
      'User.lastName',
      'User.email',
      'User.studentId',
    ])
  )
  const userId = exportData.map((user) => _.pick(user, ['User.id']))
  for (let i = 0; i < userId.length; i++) {
    userId[i].id = userId[i]['User.id']
    delete userId[i]['User.id']
  }
  for (let i = 0; i < userId.length; i++) {
    _.extend(dataArr[i], userId[i])
  }
  const updateUserImport = () => {
    try {
      dataArr.map((user) => {
        const response = axiosClient.put(`/api/user/${user.id}`, {
          firstName: user.firstName,
          lastName: user.lastName,
          studentId: user.studentId,
        })
      })
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
        setDataArr(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    promise.then((d) => {
      console.log('dataLog:', d)
    })
  }
  const RenderCSVReader = () => {
    return (
      <>
        <CSVrender>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0]
              readExcel(file)
            }}
          ></input>
        </CSVrender>
      </>
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
      <Button variant="outlined" sx={{ ml: 3 }}>
        <CSVLink {...csvReport}>Export Data</CSVLink>
      </Button>
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
            {userRole === 'TEACHER' && renderExcelFile()}
            {RenderCSVReader()}
          </Header>
          {renderTeachersList()}
          {renderStudentsList()}
        </Container>
      )}
    </>
  )
}

export default UserList
