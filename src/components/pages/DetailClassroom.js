import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import axiosClient from '../../axiosClient'
import { useParams } from 'react-router-dom'
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
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { userSetRole } from 'src/redux/userSlice'

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
  const dispatch = useDispatch()
  const userRole = useSelector((state) => state.user.role)
  let { id } = useParams()
  useEffect(() => {
    async function fetchData() {
      try {
        const results = await axiosClient.get(`/api/classrooms/${id}`)
        dispatch(userSetRole(results.data.userRole))
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
          <CopyToClipboard text={classroom.id} onCopy={() => setCopyLink(true)}>
            <Button size="large">copy link</Button>
          </CopyToClipboard>
        </CardActions>
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
            <Button size="small">learn more</Button>
          </MyCardActions>
        </MyCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {userRole === 'TEACHER' && showClassCode(classroom.id)}
            {userRole === 'STUDENT' && showNotification('Some Information')}
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
