import React from 'react'
import Alert from '@mui/material/Alert'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from '@mui/material'
export const showErrMsg = (msg) => {
  return <Alert severity="error">{msg}</Alert>
}

export const showSuccessMsg = (msg) => {
  return <Alert severity="success">{msg}</Alert>
}
export const showDialogMsg = (props) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Notification</DialogTitle>
      <DialogContent>{props.msg}</DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
