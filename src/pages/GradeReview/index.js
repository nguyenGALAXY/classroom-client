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
} from '@mui/material'
import {
  AddSharp,
  ArrowBackIosNew,
  FileDownload,
  FileUpload,
} from '@mui/icons-material'
import Layout from '../../Layout/Layout'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import GradeReviewCard from './GradesReviewCard'
import NoDataDisplay from 'src/components/NoDataDisplay'
import { NoDataIll } from 'src/_mocks_/Illustrations'
import RequestReviewCard from './RequestReviewCard'
import { userSetRole } from 'src/redux/userSlice'

const Header = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 24px;
  box-shadow: 0 6px 4px -4px rgb(0 0 0 / 20%);
`

const GradesReview = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const user = useSelector((state) => state.user.user)
  const userRole = useSelector((state) => state.user.role)
  const [gradesReview, setGradesReview] = useState([])
  const [requestReviews, setRequestReviews] = useState([])
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  useEffect(() => {
    if (!_.isEmpty(user)) {
      if (userRole == '') {
        const fetchUserRole = async () => {
          const results = await axiosClient.get(`/api/classrooms/${id}`)
          dispatch(userSetRole(results.data.userRole))
        }
        fetchUserRole()
      }
      if (userRole == 'STUDENT') {
        const fetchUserGrades = async () => {
          try {
            const response = await axiosClient.get(
              `/api/classrooms/${id}/grades`
            )
            const listGradesMarked = response.data.filter(
              (g) => g.finalized == true
            )
            let arrGradesReview = []
            if (!_.isEmpty(listGradesMarked)) {
              listGradesMarked.forEach((g) => {
                const userFilter = g.users.filter(
                  (u) => _.get(u, 'User.id') === user.id
                )
                //Check student exist in array user
                if (userFilter.length > 0) {
                  if (userFilter[0].point || userFilter[0].point === 0) {
                    let gReview = {}
                    gReview['name'] = g.name
                    gReview['totalPoint'] = g.point
                    gReview['point'] = userFilter[0].point
                    gReview['id'] = g.id
                    gReview['reviewGradeId'] = userFilter[0].reviewGradeId
                    gReview['classroomId'] = g.classroomId
                    arrGradesReview.push(gReview)
                  }
                }
              })
            }
            setGradesReview(arrGradesReview)
          } catch (error) {
            setErrorMsg(error.response.data.message)
          }
        }
        fetchUserGrades()
      }
      if (userRole == 'TEACHER') {
        const fetchUserGrades = async () => {
          try {
            const response = await axiosClient.get(
              `/api/classrooms/${id}/grades/reviewGrade`
            )
            setRequestReviews(response.data.reviewGrade)
          } catch (error) {
            setErrorMsg(error.response.data.message)
          }
        }
        fetchUserGrades()
      }
      setIsLoading(false)
    }
  }, [user, userRole])

  const goBack = () => {
    history.goBack()
  }
  const renderGradesList = () => {
    return (
      <>
        {!gradesReview.length ? (
          NoDataDisplay({
            msgSuggest:
              'There are no grade compositions, wait teacher mark s finalize',
            photoURL: NoDataIll.photoURL,
            displayName: NoDataIll.displayName,
          })
        ) : (
          <Grid
            container
            spacing={1}
            direction={'column'}
            sx={{
              mt: 3,
              display: 'inline-block',
            }}
          >
            {gradesReview.map((g, index) => (
              <Grid key={index} item>
                <GradeReviewCard props={g} />
              </Grid>
            ))}
          </Grid>
        )}
      </>
    )
  }
  const renderRequestReviewList = (
    <>
      {!requestReviews.length ? (
        NoDataDisplay({
          msgSuggest: 'There are no request review, right now',
          photoURL: NoDataIll.photoURL,
          displayName: NoDataIll.displayName,
        })
      ) : (
        <Grid
          container
          spacing={1}
          direction={'column'}
          sx={{
            mt: 3,
            display: 'inline-block',
          }}
        >
          {requestReviews.map((g, index) => (
            <Grid key={index} item>
              <RequestReviewCard props={g} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
  return (
    <>
      <Layout />
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Container minWidth="lg" spacing={2}>
          <Header>
            <IconButton onClick={goBack}>
              <ArrowBackIosNew />
            </IconButton>
            <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
              Grades review
            </Typography>
          </Header>
          {userRole == 'STUDENT' && renderGradesList()}
          {userRole == 'TEACHER' && renderRequestReviewList}
        </Container>
      )}
    </>
  )
}

export default GradesReview
