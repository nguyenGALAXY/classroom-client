import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import axiosClient from '../../axiosClient'
import Header from '../../Layout/Header/Header'
import { Box, Button, CircularProgress } from '@mui/material'

function useQuery() {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

const JoinClassroom = () => {
  const query = useQuery()
  const history = useHistory()
  const classroomId = query.get('id')
  const [errorMessage, setErrorMessage] = useState('')

  const goToHomePage = () => {
    history.push('/')
  }

  useEffect(() => {
    const joinClass = async () => {
      try {
        const response = await axiosClient.post('/api/classrooms/join', {
          classroomId,
          role: 'STUDENT',
        })
        const { classroomId: responseClassroomId } = response.data

        history.push(`/classrooms/${responseClassroomId}`)
      } catch (error) {
        error.response.data.message &&
          setErrorMessage(error.response.data.message)
      }
    }

    joinClass()
  }, [])
  return (
    <>
      <Header></Header>
      {errorMessage ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ pt: 2 }}>{errorMessage}</Box>
          <Button onClick={goToHomePage}> Go to homepage </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            pt: 2,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
          <Box
            sx={{
              pt: 2,
            }}
          >
            Joining class
          </Box>
        </Box>
      )}
    </>
  )
}

export default JoinClassroom
