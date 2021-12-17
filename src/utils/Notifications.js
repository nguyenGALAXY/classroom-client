import React from 'react'
import Alert from '@mui/material/Alert'
import { Snackbar } from '@mui/material'
export const showErrMsg = (msg) => {
  return <Alert severity="error">{msg}</Alert>
}

export const showSuccessMsg = (msg) => {
  return <Alert severity="success">{msg}</Alert>
}
