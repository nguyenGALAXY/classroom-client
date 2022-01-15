import React, { useState } from 'react'
import { Modal, Grid, Typography, TextField, Button } from '@mui/material'
import axiosClient from 'src/axiosClient'
import { showErrMsg } from 'src/utils/Notifications'
import { useSnackbar } from 'notistack'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
}

const RequestReviewModal = ({
  open,
  handleClose,
  classroomId,
  gradeId,
  setReviewGradeId,
}) => {
  const [errExplan, setErrExplan] = useState(false)
  const [errExpect, setErrExpect] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [disabled, setDisabled] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const explanation = data.get('explanation')
    const expectationGrade = parseInt(data.get('expectationGrade'))
    if (explanation == null) {
      setErrExplan(true)
      return
    }
    if (expectationGrade == null) {
      setErrExpect(true)
      return
    }
    try {
      const response = await axiosClient.post(
        `/api/classrooms/${classroomId}/grades/reviewGrade/${gradeId}`,
        {
          explanation: explanation,
          expectationGrade: expectationGrade,
        }
      )
      enqueueSnackbar('Request review success', { variant: 'success' })
      setReviewGradeId(response.data.reviewGradeId)
      handleClose()
    } catch (error) {
      setErrMsg(error.message)
    }
    setDisabled(false)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid sx={style} container onSubmit={handleSubmit} component="form">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mr: 'auto', mb: 1, width: '100%' }}
          >
            Request review
          </Typography>

          {errMsg && showErrMsg(errMsg)}

          <TextField
            margin="normal"
            type="number"
            required
            fullWidth
            error={errExpect}
            name="expectationGrade"
            label="Expectation Grade"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="explanation"
            label="Explanation"
            error={errExplan}
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, ml: 'auto' }}
            disabled={disabled}
          >
            Post
          </Button>
        </Grid>
      </Modal>
    </div>
  )
}

export default RequestReviewModal
