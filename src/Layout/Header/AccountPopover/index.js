import { useRef, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import { Link as RouterLink } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material'

import MenuPopover from 'src/Layout/Header/MenuPopover'

import accountDefault from 'src/_mocks_/account'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from 'src/redux/userSlice'

export default function AccountPopover() {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleLogout = () => {
    localStorage.clear()
    history.push('/login')
    dispatch(userLogout())
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
        <Avatar src={user.picture ? user.picture : accountDefault.photoURL} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            Username
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.username}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          to={'/'}
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: 'h6', py: 1, px: 2.5 }}
        >
          <Box
            sx={{
              mr: 2,
              width: 24,
              height: 24,
            }}
          >
            <HomeIcon fontSize="large" />
          </Box>
          Home
        </MenuItem>
        <MenuItem
          to={'/profile'}
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: 'h6', py: 1, px: 2.5 }}
        >
          <Box
            sx={{
              mr: 2,
              width: 24,
              height: 24,
            }}
          >
            <PersonIcon fontSize="large" />
          </Box>
          Profile
        </MenuItem>

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  )
}
