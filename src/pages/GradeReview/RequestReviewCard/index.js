import { Avatar, Card, CardHeader, IconButton, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { styled } from '@mui/styles'
import PreviewIcon from '@mui/icons-material/Preview'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import get from 'lodash/get'
import { Link } from 'react-router-dom'

const MyCardHeader = styled(CardHeader)({
  '& .MuiCardHeader-title': {
    fontSize: '20px',
    color: 'GrayText',
    fontWeight: 'bold',
  },
})

export default function RequestReviewCard({ props }) {
  console.log(props)
  const reviewGradeId = props.id
  const gradeName = get(props, 'Grade.name')
  const username = get(props, 'User.username')
  return (
    <>
      <Card sx={{ mt: 2 }}>
        <MyCardHeader
          avatar={
            <Avatar sx={{ bgcolor: grey[800] }}>
              <PreviewIcon />
            </Avatar>
          }
          action={
            <IconButton
              component={Link}
              to={`/classrooms/${get(
                props,
                'Grade.classroomId'
              )}/grades-review/${reviewGradeId}`}
              aria-label="settings"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          }
          title={gradeName}
          subheader={<Typography>{username}</Typography>}
        />
      </Card>
    </>
  )
}
