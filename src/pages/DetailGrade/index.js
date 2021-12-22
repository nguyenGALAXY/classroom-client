import React, { useEffect, useState } from 'react'
import axiosClient from 'src/axiosClient'
import { useParams, useHistory } from 'react-router-dom'
import {
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardHeader,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material'
import Layout from '../../Layout/Layout'
import {
  DataGrid,
  GridToolbar,
  GridFilterMenuItem,
  SortGridMenuItems,
  GridColumnMenuContainer,
} from '@mui/x-data-grid'
import { styled } from '@mui/styles'
import { ArrowBackIosNew } from '@mui/icons-material'
import { NoDataIll } from 'src/_mocks_/Illustrations'
import accountDefault from 'src/_mocks_/account'
import _ from 'lodash'
import lodashGet from 'lodash/get'
import { useSnackbar } from 'notistack'
import NoDataDisplay from 'src/components/NoDataDisplay'
import LoadingPage from 'src/components/LoadingPage'
import { showDialogMsg } from 'src/utils/Notifications'
import DownloadCSV from './DownloadCSV'
import * as XLSX from 'xlsx'

const CustomCard = styled(Card)`
  &.sticky {
    position: sticky;
    top: 10px;
    z-index: 2;
  }
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

const ButtonMenuTable = styled(Button)({
  justifyContent: 'flex-start',
  color: '#000000',
})

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

function CustomColumnMenuComponent(props) {
  const { hideMenu, currentColumn } = props
  if (
    currentColumn.field === 'fullName' ||
    currentColumn.field === 'TotalGrade' ||
    currentColumn.field === 'studentId'
  ) {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
      >
        <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
      </GridColumnMenuContainer>
    )
  }

  return (
    <GridColumnMenuContainer hideMenu={hideMenu} currentColumn={currentColumn}>
      <Box
        sx={{
          width: 120,
          height: '100%',
        }}
      >
        <ButtonMenuTable fullWidth>
          <label>
            <input
              style={{ display: 'none' }}
              id={currentColumn.field}
              type="file"
              onChange={async (e) => {
                const gradeId = e.target.id
                const file = e.target.files[0]
                const uploadedData = await readExcel(file)

                // Uploaded data will have value like: studentId: number, point: number
                props.enqueueSnackbar(
                  'Set grade success, please Save Grades to update',
                  {
                    variant: 'info',
                  }
                )
                props.handleUploadedGrades(gradeId, uploadedData)
              }}
            />
            Upload grade
          </label>
        </ButtonMenuTable>

        <DownloadCSV
          data={props.rows}
          id={currentColumn.field}
          filename={currentColumn.headerName}
        ></DownloadCSV>
        <ButtonMenuTable
          id={currentColumn.field}
          onClick={props.handleSaveGrades}
          fullWidth
        >
          Save grades
        </ButtonMenuTable>
        <ButtonMenuTable
          id={currentColumn.field}
          onClick={props.handleMarkGrades}
          fullWidth
        >
          Mark finalized
        </ButtonMenuTable>
      </Box>
    </GridColumnMenuContainer>
  )
}

const DetailGrades = () => {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [listGradeStudent, setListGradeStudent] = useState(null)
  const [users, setUsers] = useState(null)
  const [rows, setRows] = useState([])
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [dialogMsg, setDialogMsg] = useState(null)
  const [columns, setColumns] = useState([
    {
      field: 'studentId',
      headerName: 'Student ID',
      description: 'Need student Id to upload grade',
      width: 150,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'Show full name or username',
      sortable: false,
      width: 260,
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

  const handleCloseDialog = () => {
    setDialogMsg(null)
  }

  const goBack = () => {
    history.goBack()
  }

  const handleMarkGrades = async (event) => {
    event.preventDefault()
    const gradeId = event.target.id
    const grade = listGradeStudent.filter((g) => g.id == gradeId)
    if (grade[0].finalized === true) {
      setDialogMsg('Grade already marked finalized')
      return
    }
    try {
      const response = await axiosClient.post(
        `/api/classrooms/${id}/grades/${gradeId}/finalized`
      )
      setListGradeStudent((prev) =>
        prev.map((row) =>
          row.id === grade[0].id ? { ...row, finalized: true } : row
        )
      )
      enqueueSnackbar(response.data.message, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const handleUploadedGrades = async (gradeId, data) => {
    setRows((prevState) => {
      return prevState.map((gradeUser) => {
        const studentId = gradeUser.studentId

        // find the student have studentId in uploaded data
        const uploadedStudent = data.find((d) => d.studentId == studentId)

        let newPoint
        if (uploadedStudent) {
          newPoint = uploadedStudent.point
        } else {
          return { ...gradeUser }
        }

        // find the grade currently editing to check valid point
        const gradeEdited = listGradeStudent.find((g) => g.id == gradeId)

        if (newPoint > gradeEdited.point) {
          return { ...gradeUser, [gradeId]: null }
        } else {
          return { ...gradeUser, [gradeId]: newPoint }
        }
      })
    })
  }

  const handleSaveGrades = async (event) => {
    event.preventDefault()
    const field = event.target.id

    const colGrades = rows.map((row) => {
      const { id } = row
      const point = row[field]
      return { userId: id, point: point }
    })

    try {
      const response = await axiosClient.post(
        `/api/classrooms/${id}/grades/${field}`,
        {
          colGrades,
        }
      )
      const updatedGrade = response.data.data
      updatedGrade.forEach((g) => {
        setRows((prev) =>
          prev.map((row) =>
            row.id === g.userId ? { ...row, [field]: g.point } : row
          )
        )
      })
      updateTotalGrades(rows)
      enqueueSnackbar(response.data.message, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const updateTotalGrades = (rows) => {
    rows.forEach((row) => {
      let totalGradeRow = 0
      for (const props in row) {
        if (
          props === 'fullName' ||
          props === 'picture' ||
          props === 'id' ||
          props === 'TotalGrade' ||
          props === 'studentId'
        ) {
          continue
        } else {
          totalGradeRow += row[props]
        }
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, TotalGrade: totalGradeRow } : r
        )
      )
    })
  }

  const handleCommitCell = async (params) => {
    const gradeEdited = listGradeStudent.find((g) => g.id === params.field)
    if (params.value > gradeEdited.point) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === params.id ? { ...row, [params.field]: null } : row
        )
      )
      enqueueSnackbar('Grade input out of total grade', { variant: 'error' })
      return
    }

    setRows((prev) =>
      prev.map((row) =>
        row.id === params.id ? { ...row, [params.field]: params.value } : row
      )
    )

    enqueueSnackbar('Set grade success, please Save Grades to update', {
      variant: 'info',
    })
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
            onCellEditCommit={handleCommitCell}
            sx={{ fontSize: '20px' }}
            components={{
              Toolbar: GridToolbar,
              ColumnMenu: CustomColumnMenuComponent,
            }}
            componentsProps={{
              columnMenu: {
                handleSaveGrades,
                handleMarkGrades,
                handleUploadedGrades,
                enqueueSnackbar,
                rows,
              },
            }}
          />
        </div>
      </div>
    </div>
  )

  const createColTable = (g, editable) => {
    const col = {
      field: g.id,
      headerName: g.name,
      type: 'number',
      minWidth: 150,
      editable: editable,
      renderHeader: (params) => (
        <>
          <Grid
            container
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '150px',
            }}
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Typography noWrap sx={{ mb: 0.5 }} variant="h5">
                {g.name}
              </Typography>
              <Divider />
            </Grid>
            <Grid item>
              <Typography noWrap variant="subtitle1">
                Total grade: {g.point}
              </Typography>
            </Grid>
          </Grid>
        </>
      ),
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
    return col
  }

  const mapUser = ['User.id', 'point', 'User.picture', 'User.studentId']

  let keymapUser = {
    'User.id': 'id',
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
        const users = response.data.filter(
          (user) =>
            user.role === 'STUDENT' &&
            lodashGet(user, 'User.studentId') !== null
        )
        const listGradeStudent = res.data
        if (users && listGradeStudent) {
          let arrData = []
          let tempCol = []
          let totalGrade = {
            id: 'TotalGrade', //Field col
            name: 'Total Grade', // Header Name
            point: 0,
          }
          //Add grades field to column
          listGradeStudent.forEach((g) => {
            const temp = createColTable(g, true)
            tempCol.push(temp)
            totalGrade.point += g.point
          })
          //Add total grade column
          const temp = createColTable(totalGrade, false)
          tempCol.push(temp)
          //--------------
          users.forEach((user) => {
            let row = [
              _.mapKeys(_.pick(user, mapUser), function (v, k) {
                return keymapUser[k]
              }),
            ]
            row[0]['fullName'] = user.fullName
            //Total grade of student
            let totalGradeRow = 0
            listGradeStudent.forEach((g) => {
              const userFilter = g.users.filter(
                (u) => lodashGet(u, 'User.id') === user.userId
              )
              //Check student exist in array user
              if (userFilter.length > 0) {
                if (userFilter[0].point || userFilter[0].point === 0) {
                  row[0][g.id] = userFilter[0].point
                  totalGradeRow += userFilter[0].point
                } else {
                  row[0][g.id] = null
                  totalGradeRow += 0
                }
              }
            })
            row[0][totalGrade.id] = totalGradeRow
            arrData.push(row[0])
          })
          setRows(arrData)
          const col = columns.concat(tempCol)
          setColumns(col)
        }
        setListGradeStudent(listGradeStudent)
        setUsers(response.data.filter((user) => user.role === 'STUDENT'))
        setIsLoading(false)
      } catch (error) {
        enqueueSnackbar(error.message)
      }
    }
    getGradeDetail()
  }, [])

  return (
    <Layout>
      <Box
        sx={{
          mt: 2,
          mb: 2,
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
      {isLoading ? (
        LoadingPage()
      ) : (
        <>
          {dialogMsg &&
            showDialogMsg({
              open: Boolean(dialogMsg),
              msg: dialogMsg,
              handleClose: handleCloseDialog,
            })}
          {!rows.length
            ? NoDataDisplay({
                msgSuggest: 'Please check user list or grade structuce',
                photoURL: NoDataIll.photoURL,
                displayName: NoDataIll.displayName,
              })
            : renderTableGrade(rows)}
        </>
      )}
    </Layout>
  )
}

export default DetailGrades
