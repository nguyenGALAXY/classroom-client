import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import axiosClient from '../../axiosClient'
import Header from '../../Layout/Header/Header'
import { Box, Button, CircularProgress } from '@mui/material'
import { showErrMsg } from 'src/utils/Notifications'

function useQuery() {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

const AcceptInvite = () => {
  const query = useQuery()
  const history = useHistory()
  const [errorMessage, setErrorMessage] = useState('')

  const goToHomePage = () => {
    history.push('/')
  }

  useEffect(() => {
    const token = query.get('t')
    const acceptInvite = async () => {
      try {
        const response = await axiosClient.put(
          '/api/classrooms/join/accept-token',
          {
            token,
          }
        )

        const { classroomId } = response.data
        history.push(`/classrooms/${classroomId}`)
      } catch (error) {
        error.response.data.message &&
          setErrorMessage(error.response.data.message)
      }
    }

    acceptInvite()
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
            mt: 4,
          }}
        >
          {showErrMsg(errorMessage)}
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

export default AcceptInvite
