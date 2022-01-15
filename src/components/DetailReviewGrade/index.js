import React, { useEffect, useState } from 'react'
import axiosClient from 'src/axiosClient'
import { useParams, Redirect, useHistory } from 'react-router-dom'
import {
  Grid,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Divider,
  Skeleton,
  TextField,
} from '@mui/material'
import {
  AddSharp,
  ArrowBackIosNew,
  FileDownload,
  FileUpload,
  MoreVert,
} from '@mui/icons-material'
import Layout from '../../Layout/Layout'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import NoDataDisplay from 'src/components/NoDataDisplay'
import { NoDataIll } from 'src/_mocks_/Illustrations'
import trim from 'lodash/trim'
import Comment from './CommentReview'
import { userSetRole } from 'src/redux/userSlice'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import ModalFinalDesicion from './ModalFinalDesicon'
const Header = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 24px;
  box-shadow: 0 6px 4px -4px rgb(0 0 0 / 20%);
`

const LabelInput = styled(Typography)(({ theme }) => ({
  color: '#6b778c',
  fontWeight: '600',
}))
const DetailReviewGrade = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const { id, reviewGradeId } = useParams()
  const user = useSelector((state) => state.user.user)
  const userRole = useSelector((state) => state.user.role)
  const [gradesReview, setGradesReview] = useState({})
  const [Comments, setComments] = useState([])
  const [isloading, setIsLoading] = useState(true)
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [newComment, setNewComment] = useState('')
  const [openFinalModal, setOpenFinalModal] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)
  const dispatch = useDispatch()
  const handleOpenFinalModal = () => {
    setOpenFinalModal(true)
  }
  const handleCloseFinalModal = () => {
    setOpenFinalModal(false)
  }
  const handleSetFinalDecision = () => {
    setUpdateStatus(true)
  }
  useEffect(() => {
    if (!_.isEmpty(user)) {
      if (userRole == '') {
        const fetchUserRole = async () => {
          const results = await axiosClient.get(`/api/classrooms/${id}`)
          dispatch(userSetRole(results.data.userRole))
        }
        fetchUserRole()
      }
      const fetchUserGrades = async () => {
        try {
          const response = await axiosClient.get(
            `/api/classrooms/${id}/grades/reviewGrade/${reviewGradeId}`
          )
          setGradesReview(response.data.reviewGrade)
          setComments(response.data.commentsReview)
          setIsLoading(false)
        } catch (error) {
          setErrorMsg(error.response.data.message)
        }
      }
      fetchUserGrades()
    }
  }, [user, userRole, updateStatus])

  const goBack = () => {
    history.goBack()
  }
  const handleChangeNewComment = (e) => {
    e.preventDefault()
    setNewComment(e.target.value)
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment || trim(newComment).length === 0) {
      enqueueSnackbar('Can not post empty comment.', {
        variant: 'error',
      })
    } else {
      try {
        const response = await axiosClient.post(
          `/api/classrooms/${id}/grades/reviewGrade/${reviewGradeId}/comment`,
          {
            content: newComment,
          }
        )
        let tempComment = response.data.comment
        tempComment['User.picture'] = user.picture
        tempComment['User.username'] = user.username
        setComments((prevState) => {
          const comment = tempComment
          return [...prevState, comment]
        })
        setNewComment('')
        enqueueSnackbar('Post comment successful.', {
          variant: 'success',
        })
      } catch (error) {
        enqueueSnackbar('Error while posting comment.', {
          variant: 'error',
        })
      }
    }
  }
  const renderReviewGrade = (
    <Grid
      container
      spacing={1}
      direction={'column'}
      sx={{
        mt: 3,
        display: 'inline-block',
      }}
    >
      <Grid item>
        <Grid container direction={'row'} justifyContent={'space-between'}>
          <Grid item>
            <LabelInput variant="h3" gutterBottom>
              {_.get(gradesReview, 'Grade.name')}
            </LabelInput>
          </Grid>
          <Grid item>
            {gradesReview.finalDecision == true ? (
              <Typography
                sx={{ fontWeight: 'bold' }}
                variant="h4"
                color="error"
              >
                Closed review
              </Typography>
            ) : (
              <>
                <Typography
                  sx={{ fontWeight: 'bold' }}
                  variant="h4"
                  color="#229A16"
                >
                  Reviewing
                </Typography>
                {userRole == 'TEACHER' && (
                  <IconButton
                    onClick={handleOpenFinalModal}
                    aria-label="settings"
                  >
                    <BorderColorIcon />
                  </IconButton>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction={'row'} spacing={2}>
          <Grid item xs>
            <Grid container direction={'row'} spacing={1}>
              <Grid item>
                <LabelInput variant="h6">From:</LabelInput>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {_.get(gradesReview, 'GradeUser.User.username')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid container direction={'row'} spacing={1}>
              <Grid item>
                <LabelInput variant="h6">Student ID:</LabelInput>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {_.get(gradesReview, 'GradeUser.User.studentId')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {gradesReview.finalDecision == true ? (
        <Grid item>
          <Grid container direction={'row'} spacing={1}>
            <Grid item>
              <LabelInput variant="h6">Final Point:</LabelInput>
            </Grid>
            <Grid item>
              <Typography variant="h6" color="primary">
                {_.get(gradesReview, 'GradeUser.point')}_/
                {_.get(gradesReview, 'Grade.point')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item>
          <Grid container direction={'row'} spacing={2}>
            <Grid item xs>
              <Grid container direction={'row'} spacing={1}>
                <Grid item>
                  <LabelInput variant="h6">Present point:</LabelInput>
                </Grid>
                <Grid item>
                  <Typography variant="h6" color="error">
                    {_.get(gradesReview, 'GradeUser.point')}_/
                    {_.get(gradesReview, 'Grade.point')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Grid container direction={'row'} spacing={1}>
                <Grid item>
                  <LabelInput variant="h6">Expectation Point:</LabelInput>
                </Grid>
                <Grid item>
                  <Typography variant="h6" color="#229A16">
                    {gradesReview.expectationGrade}_/
                    {_.get(gradesReview, 'Grade.point')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Grid container direction={'row'} spacing={1}>
          <Grid item>
            <LabelInput variant="h6">Explanation:</LabelInput>
          </Grid>
          <Grid item>
            <Typography variant="h6">{gradesReview.explanation}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
  return (
    <>
      <Layout />
      {errorMsg ? (
        <Redirect to="/" />
      ) : (
        <Container minWidth="lg" spacing={2}>
          <Header>
            <IconButton onClick={goBack}>
              <ArrowBackIosNew />
            </IconButton>
            <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
              Detail review grade
            </Typography>
          </Header>
          <ModalFinalDesicion
            open={openFinalModal}
            handleClose={handleCloseFinalModal}
            classroomId={id}
            gradesReview={gradesReview}
            handleSetFinalDecision={handleSetFinalDecision}
          />
          {isloading ? <LinearProgress /> : renderReviewGrade}
          <Divider sx={{ mt: 3, mb: 3 }} />
          <Grid container direction={'column'} spacing={2}>
            <Grid item>
              <Typography sx={{ fontWeight: 'bold' }} variant="h5">
                Comments
              </Typography>
            </Grid>
            <Grid item>
              {isloading ? (
                <Skeleton
                  sx={{ height: 100, borderRadius: 1 }}
                  animation="wave"
                  variant="rectangular"
                />
              ) : (
                Comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              )}
            </Grid>
            {gradesReview.finalDecision != true && (
              <Grid item>
                <Grid
                  container
                  direction={'row'}
                  component={'form'}
                  onSubmit={handleSubmitComment}
                >
                  <Grid item lg={12}>
                    <TextField
                      placeholder="Enter new comment"
                      multiline
                      fullWidth
                      value={newComment}
                      onChange={handleChangeNewComment}
                      minRows={2}
                      variant="standard"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ marginLeft: 'auto' }}
                    >
                      Comment
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </>
  )
}

export default DetailReviewGrade
