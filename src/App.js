import React from 'react'
import Router from './Routes'
import { CssBaseline } from '@mui/material'
import './app.css'
import { fetchUser } from './redux/userSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//Test jenkins build real
function App() {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.user)
  useEffect(() => {
    async function fetchAPI() {
      dispatch(fetchUser())
    }
    fetchAPI()
  }, [auth.isLogged, dispatch])
  return (
    <div className="App">
      <CssBaseline />
      <Router />
    </div>
  )
}

export default App
