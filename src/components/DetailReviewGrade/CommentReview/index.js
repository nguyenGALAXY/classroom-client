import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles'
import { Box, Grid, Avatar, Paper, Button, TextField } from '@mui/material'
import { ChatBubbleOutline as ChatBubbleOutlineIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import trim from 'lodash/trim'
import accountDefault from 'src/_mocks_/account'
import { formatDistanceToNow } from 'date-fns'

const CommentPaper = styled(Paper)`
  padding: 20px 20px;
  margin: 20px 0;
`

const Comment = ({ comment }) => {
  const { enqueueSnackbar } = useSnackbar()
  const avatarUser = get(comment, 'User.picture')
  const username = get(comment, 'User.username')
  return (
    <Box>
      <CommentPaper>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar
              alt="user avatar"
              src={
                avatarUser && avatarUser !== ''
                  ? avatarUser
                  : accountDefault.photoURL
              }
            />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <Box>
              <h4 style={{ margin: 0, textAlign: 'left' }}>{username}</h4>
              <p style={{ margin: 0, textAlign: 'left', color: 'gray' }}>
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </p>
              <p style={{ textAlign: 'left' }}>{comment.content}</p>
            </Box>
          </Grid>
        </Grid>
      </CommentPaper>
    </Box>
  )
}

export default Comment
