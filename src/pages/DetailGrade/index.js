import React, { useEffect, useState } from 'react'
import axiosClient from 'src/axiosClient'
import { useParams, Redirect, useHistory } from 'react-router-dom'
import {
  Grid,
  Typography,
  Container,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CssBaseline,
  Avatar,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Layout from '../../Layout/Layout'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/styles'
import { ArrowBackIosNew } from '@mui/icons-material'
import { NoDataIll } from 'src/_mocks_/Illustrations'
import accountDefault from 'src/_mocks_/account'
import _ from 'lodash'
import lodashGet from 'lodash/get'
const CustomCard = styled(Card)`
  &.sticky {
    position: sticky;
    top: 10px;
    z-index: 2;
  }
`
const CustomTable = styled('div')`
  height: 400;
  width: '100%';
`
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === 'light'
      ? 'rgba(0,0,0,.85)'
      : 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-cell': {
    color:
      theme.palette.mode === 'light'
        ? 'rgba(0,0,0,.85)'
        : 'rgba(255,255,255,0.65)',
  },
}))
const theme = createTheme()
const DetailGrades = () => {
  const history = useHistory()
  const [listGradeStudent, setListGradeStudent] = useState(null)
  const [users, setUsers] = useState(null)
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 260,
      valueGetter: (params) => {
        const fisrtName = params.getValue(params.id, 'firstName')
        const lastName = params.getValue(params.id, 'lastName')
        if (!fisrtName && !lastName)
          return `${params.getValue(params.id, 'username')}`
        return `${fisrtName || ''} ${lastName || ''}`
      },
      renderCell: (params) => (
        <>
          <Avatar
            sx={{ width: 30, height: 30, mr: 1 }}
            src={
              params.getValue(params.id, 'picture')
                ? params.getValue(params.id, 'picture')
                : accountDefault.photoURL
            }
          ></Avatar>
          {params.value}
        </>
      ),
    },
  ])
  let { id } = useParams()
  const goBack = () => {
    history.goBack()
  }
  const renderTableGrade = (rows) => (
    <div style={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <StyledDataGrid
            rows={rows}
            columns={columns}
            pageSize={rows.length}
            autoHeight={true}
            headerHeight={150}
            hideFooter
            density="compact"
            sx={{ fontSize: '20px' }}
          />
        </div>
      </div>
    </div>
  )
  const showNoDataMsg = () => (
    <Box
      sx={{
        marginTop: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar
        src={NoDataIll.photoURL}
        alt={NoDataIll.displayName}
        sx={{ width: 320, height: 320 }}
      />
      <Typography variant="h6">No Data to show</Typography>
      <Typography variant="subtitle2">
        Please check user list or grade structuce
      </Typography>
    </Box>
  )
  const mapUser = [
    'User.id',
    'User.username',
    'User.firstName',
    'User.lastName',
    'point',
    'User.picture',
  ]
  let keymapUser = {
    'User.id': 'id',
    'User.username': 'username',
    'User.firstName': 'firstName',
    'User.lastName': 'lastName',
    'User.studentId': 'studentId',
    'User.picture': 'picture',
  }
  useEffect(() => {
    const getGradeDetail = async () => {
      try {
        const res = await axiosClient.get(`/api/classrooms/${id}/grades`)
        // Format user array
        res.data.forEach((grade, index) => {
          res.data[index].users = grade.users.map((user) =>
            _.pick(user, mapUser)
          )
        })
        //--------------------
        // Get all students in classroom
        const response = await axiosClient.get(`/api/classrooms/${id}/users`)
        const users = response.data.filter((user) => user.role === 'STUDENT')
        const listGradeStudent = res.data
        if (users && listGradeStudent) {
          let arrData = []
          let tempCol = []
          //Add field to column
          listGradeStudent.forEach((g) => {
            const temp = {
              field: g.name.split(' ').join(''),
              headerName: g.name,
              width: 150,
              renderCell: (params) => (
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    '& .point': {
                      display: 'none',
                    },
                    '&:hover .point': {
                      display: 'inline',
                    },
                  }}
                >
                  {params.value}
                  <span className="point">__/{g.point}</span>
                </Typography>
              ),
            }
            tempCol.push(temp)
          })
          //--------------
          users.forEach((user) => {
            let row = [
              _.mapKeys(_.pick(user, mapUser), function (v, k) {
                return keymapUser[k]
              }),
            ]
            listGradeStudent.forEach((g) => {
              const userFilter = g.users.filter(
                (u) => lodashGet(u, 'User.id') === user.userId
              )
              //Check student exist in array user
              if (userFilter.length > 0) {
                if (userFilter[0].point) {
                  row[0][g.name.split(' ').join('')] = userFilter[0].point
                } else {
                  row[0][g.name.split(' ').join('')] = null
                }
              }
            })
            arrData.push(row[0])
          })
          setRows(arrData)
          const col = columns.concat(tempCol)
          setColumns(col)
        }
        setListGradeStudent(listGradeStudent)
        setUsers(response.data.filter((user) => user.role === 'STUDENT'))
      } catch (error) {
        console.log('Grade Detail Error', error)
      }
    }
    getGradeDetail()
  }, [])
  return (
    <Layout>
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CustomCard sx={{ minWidth: 1200 }} className={`sticky`}>
          <CardHeader
            avatar={
              <IconButton onClick={goBack}>
                <ArrowBackIosNew />
              </IconButton>
            }
            title={<Typography variant="h6">Grade Detail</Typography>}
          />
        </CustomCard>
      </Box>
      {!rows.length ? showNoDataMsg() : renderTableGrade(rows)}
    </Layout>
  )
}

export default DetailGrades
