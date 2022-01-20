import React, { useRef } from 'react'
import Router from './Routes'
import { CssBaseline, Button, Slide } from '@mui/material'
import './app.css'
import { fetchUser } from './redux/userSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import socket, { establishNewConnection } from 'src/socket'
import { SnackbarProvider } from 'notistack'

function App() {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.user)
  const user = useSelector((state) => state.user.user)
  const notistackRef = useRef(null)

  useEffect(() => {
    async function fetchAPI() {
      dispatch(fetchUser())
    }
    fetchAPI()
  }, [auth.isLogged, dispatch])

  useEffect(() => {
    if (!isEmpty(user)) {
      socket.connect()
      establishNewConnection(user.id)
    }
  }, [user])

  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key)
  }

  return (
    <div className="App">
      <SnackbarProvider
        ref={notistackRef}
        action={(key) => (
          <Button
            onClick={onClickDismiss(key)}
            sx={{ color: (theme) => theme.palette.primary.contrastText }}
          >
            Dismiss
          </Button>
        )}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        TransitionComponent={Slide}
      >
        <CssBaseline />
        <Router />
      </SnackbarProvider>
    </div>
  )
}

export default App
