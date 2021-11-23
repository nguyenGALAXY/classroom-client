import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import axiosClient from './axiosClient'

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = !!localStorage.getItem('token')
  axiosClient.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${localStorage.getItem('token')}`

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default ProtectedRoute
