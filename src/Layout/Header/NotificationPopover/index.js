import { useRef, useState, useEffect } from 'react'
import { Notifications as NotificationsIcon } from '@mui/icons-material'
import { alpha, styled } from '@mui/material/styles'
import {
  Badge,
  Button,
  Box,
  MenuItem,
  IconButton,
  Typography,
  Link,
  Divider,
} from '@mui/material'

import MenuPopover from 'src/Layout/Header/MenuPopover'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectNotifications } from 'src/redux/notificationSlice'
import NotificationItem from './NotificationItem'
import { fetchNotifications } from 'src/redux/notificationSlice'
import { NOTIFICATION_STATUS } from 'src/utils/constants'

const Header = styled(Box)`
  padding: 6px 16px;
  display: flex;
  justify-content: space-between;
`

export default function NotificationPopover() {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)
  const user = useSelector((state) => state.user.user)
  const notifications = useSelector(selectNotifications)
  const dispatch = useDispatch()

  const unreadNotifications = notifications.filter(
    (n) => n.status === NOTIFICATION_STATUS.UNREAD
  ).length

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Badge badgeContent={unreadNotifications} color="primary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 350, maxHeight: 300, overflow: 'auto' }}
      >
        <Header>
          <Typography variant="h6">Notifications</Typography>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              console.info("I'm a button.")
            }}
          >
            View All
          </Link>
        </Header>

        <Divider />

        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </MenuPopover>
    </>
  )
}
