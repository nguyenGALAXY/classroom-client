import React, { useEffect, useState } from 'react'
import Layout from '../../Layout/Layout'
import axiosClient from '../../axiosClient'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import styled from '@emotion/styled'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Link } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  Card,
  Typography,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Container,
  CardHeader,
  IconButton,
  Grid,
  Avatar,
  TextField,
  Input,
  List,
  ListItem,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { userSetRole } from 'src/redux/userSlice'
import { fetchGrades, sortGrades } from 'src/redux/gradeSlice'

const MyContainer = styled(Container)({
  marginTop: '30px',
})
const MyCard = styled(Card)({
  color: 'black',
})
const LinkCard = styled(Card)({
  maxWidth: 300,
  marginTop: 30,
})
const MyCardActions = styled(CardActions)({})
const WorkCard = styled(Card)({
  marginTop: 30,
  marginLeft: 0,
})
const Announce = styled.div`
  display: 'inline';
  margin-top: '100px';
`
const AnnounceButton = styled(CardActions)({
  marginLeft: 700,
  marginTop: 10,
})
const InputForm = styled.div({
  marginTop: 20,
})
function DetailClassroom() {
  const [classroom, setClassroom] = useState('')
  const [copyLink, setCopyLink] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()
  const userRole = useSelector((state) => state.user.role)
  const classroomGrades = useSelector((state) => state.grades)
  let { id } = useParams()
  let { url } = useRouteMatch()
  useEffect(() => {
    async function fetchData() {
      try {
        const results = await axiosClient.get(`/api/classrooms/${id}`)
        dispatch(userSetRole(results.data.userRole))
        //check grades was store redux
        if (
          classroomGrades.classroomId === null ||
          classroomGrades.classroomId !== id
        ) {
          dispatch(
            fetchGrades({
              Grades: results.data.classroom.Grades,
              classroomId: results.data.classroom.id,
            })
          )
          dispatch(sortGrades())
        }
        setClassroom(results.data.classroom)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  const showClassCode = (classCode) => {
    return (
      <LinkCard>
        <CardContent>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Class code"
          >
            <MoreVertIcon sx={{ mt: 3 }} />
          </CardHeader>
          <Typography variant="h2" color="text.secondary">
            {classCode}
          </Typography>
        </CardContent>
        <CardActions>
          <CopyToClipboard
            text={`${process.env.REACT_APP_CLIENT_URL}/classrooms/join?id=${classCode}`}
            onCopy={() => setCopyLink(true)}
          >
            <Button size="large">copy link</Button>
          </CopyToClipboard>
        </CardActions>
      </LinkCard>
    )
  }
  const showGradeStructure = (grades, userRole) => {
    return (
      <LinkCard>
        <CardContent>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Grade Structure"
          >
            <MoreVertIcon sx={{ mt: 3 }} />
          </CardHeader>
          {!grades.length ? (
            <Typography variant="h6" color="text.secondary">
              No Grade Structure
            </Typography>
          ) : (
            <List>
              {grades.map((grades) => (
                <ListItem key={grades.id}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography variant="h6" color="text.secondary">
                        {grades.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="text.secondary">
                        {grades.point}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
        {userRole === 'TEACHER' && (
          <CardActions>
            <Button size="small" onClick={handleEditGrade}>
              Edit grade
            </Button>
          </CardActions>
        )}
      </LinkCard>
    )
  }
  const showNotification = (info) => {
    return (
      <LinkCard>
        <CardContent>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Notifications"
          >
            <MoreVertIcon sx={{ mt: 3 }} />
          </CardHeader>
          <Typography variant="h6" color="text.secondary">
            {info}
          </Typography>
        </CardContent>
      </LinkCard>
    )
  }
  const handleEditGrade = (event) => {
    event.preventDefault()
    history.push(`/classrooms/${id}/grade`)
  }
  return (
    <Layout>
      <MyContainer>
        <MyCard>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image="https://picsum.photos/200/300"
          />
          <CardContent>
            <Typography gutterBottom variant="h2" component="div" color="#a32">
              {classroom.name}
            </Typography>
            <Typography variant="h3" color="text.secondary">
              {classroom.section}
            </Typography>
          </CardContent>
          <MyCardActions>
            <Button
              size="medium"
              component={Link}
              to={`/classrooms/${id}/user-list`}
            >
              list user
            </Button>
            {userRole === 'TEACHER' && (
              <Button
                size="medium"
                component={Link}
                to={`/classrooms/${id}/detail-grades`}
              >
                Grades Board
              </Button>
            )}
            <Button size="small">learn more</Button>
          </MyCardActions>
        </MyCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {userRole === 'TEACHER' && showClassCode(classroom.id)}
            {userRole === 'STUDENT' && showNotification('Some Information')}
            {showGradeStructure(classroomGrades.grades, userRole)}
          </Grid>
          <Grid item xs={9}>
            <WorkCard>
              {showInput ? (
                <div>
                  <div>
                    <TextField
                      multiline
                      label="announce something to your class"
                      variant="filled"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      fullWidth
                    ></TextField>
                  </div>
                  <InputForm>
                    <Input type="file" variant="outline"></Input>
                  </InputForm>
                  <div>
                    <AnnounceButton>
                      <Button size="small" onClick={() => setShowInput(false)}>
                        cancel
                      </Button>
                      <Button size="small">post</Button>
                    </AnnounceButton>
                  </div>
                </div>
              ) : (
                <Announce onClick={() => setShowInput(true)}>
                  <CardHeader
                    action={
                      <IconButton aria-label="settings">
                        <Avatar />
                      </IconButton>
                    }
                  ></CardHeader>
                  <Typography sx={{ mt: 3 }} variant="h4">
                    Announce something to your class
                  </Typography>
                </Announce>
              )}
            </WorkCard>
          </Grid>
        </Grid>
      </MyContainer>
    </Layout>
  )
}

export default DetailClassroom
