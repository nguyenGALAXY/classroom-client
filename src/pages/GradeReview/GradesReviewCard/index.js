import { MoreVert } from '@mui/icons-material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Container,
  IconButton,
  Popover,
  Typography,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { styled } from '@mui/styles'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import RequestReviewModal from '../RequestReviewModal'
const MyCardHeader = styled(CardHeader)({
  '& .MuiCardHeader-title': {
    fontSize: '20px',
    color: 'GrayText',
    fontWeight: 'bold',
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '15px',
    color: '#229A16',
    fontWeight: 'bold',
  },
})
export default function GradeReviewCard({ props }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openRequestModal, setOpenRequestModal] = useState(false)
  const [reviewGradeId, setReviewGradeId] = useState(props.reviewGradeId)
  const handleCloseRequestModal = () => {
    setOpenRequestModal(false)
    handleClose()
  }

  const handleOpenRequestModal = () => {
    setOpenRequestModal(true)
  }

  const handleOpenMoreOption = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  return (
    <>
      <RequestReviewModal
        open={openRequestModal}
        handleClose={handleCloseRequestModal}
        classroomId={props.classroomId}
        setReviewGradeId={setReviewGradeId}
        gradeId={props.id}
      />
      <Popover
        id={props.id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        {reviewGradeId == null ? (
          <Button onClick={handleOpenRequestModal} variant="text">
            Request review
          </Button>
        ) : (
          <Button
            component={Link}
            to={`/classrooms/${props.classroomId}/grades-review/${reviewGradeId}`}
            variant="text"
          >
            View review grade
          </Button>
        )}
      </Popover>
      <Card sx={{ mt: 2 }}>
        <MyCardHeader
          avatar={
            <Avatar sx={{ bgcolor: grey[800] }}>
              <MenuBookIcon />
            </Avatar>
          }
          action={
            <IconButton onClick={handleOpenMoreOption} aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={props.name}
          subheader={'Point: ' + props.point + '/' + props.totalPoint}
        />
      </Card>
    </>
  )
}
