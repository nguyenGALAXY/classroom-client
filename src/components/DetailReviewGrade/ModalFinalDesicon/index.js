import React, { useEffect, useState } from 'react'
import { Modal, Grid, Typography, TextField, Button } from '@mui/material'
import axiosClient from 'src/axiosClient'
import { showErrMsg } from 'src/utils/Notifications'
import { useSnackbar } from 'notistack'
import get from 'lodash/get'
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

const ModalFinaldecision = ({
  open,
  handleClose,
  gradesReview,
  classroomId,
  handleSetFinalDecision,
}) => {
  const [errPoint, setErrPoint] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [disabled, setDisabled] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [finalPoint, setFinalPoint] = useState(null)
  const totalPoint = get(gradesReview, 'Grade.point')
  const gradeId = get(gradesReview, 'Grade.id')
  const userId = get(gradesReview, 'GradeUser.User.id')
  useEffect(() => {
    setFinalPoint(get(gradesReview, 'GradeUser.point'))
  }, [gradesReview])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (finalPoint == null) {
      setErrPoint(true)
      return
    }
    if (finalPoint > totalPoint || finalPoint < 0) {
      setErrMsg('Final point out of range')
      return
    }
    try {
      const respone = axiosClient.post(
        `/api/classrooms/${classroomId}/grades/reviewGrade/${gradesReview.id}/finalDecision`,
        {
          gradeId,
          userId,
          point: finalPoint,
        }
      )
      enqueueSnackbar('Request review success', { variant: 'success' })
      handleSetFinalDecision()
      handleClose()
    } catch (error) {
      setErrMsg(error.message)
    }
    setDisabled(false)
  }
  const handleOnChangePoint = (e) => {
    setFinalPoint(e.target.value)
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
            Final Decision
          </Typography>

          {errMsg && showErrMsg(errMsg)}

          <TextField
            margin="normal"
            type="number"
            required
            fullWidth
            error={errPoint}
            onChange={handleOnChangePoint}
            value={finalPoint}
            label="Final Point"
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, ml: 'auto' }}
            disabled={disabled}
          >
            Submit
          </Button>
        </Grid>
      </Modal>
    </div>
  )
}

export default ModalFinaldecision
