import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import { Close } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
const Container = styled.div`
  font-family: Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.2px;
  line-height: 20px;
  padding: 0 24px;
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const JoinClassWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 0.0625rem solid #e0e0e0;
  padding: 0.5rem 1rem;
  width: 98vw;
`
const JoinClassIconClose = styled(Close)({
  width: '24',
  height: '24',
  cursor: 'pointer',
})
const JoinClassBtn = styled(Button)({
  width: '40px !important',
  height: '40px !important',
})
const JoinClassForm = styled.div`
  margin-top: 1rem;
  max-width: 35rem;
  box-sizing: border-box;
  padding: 1.5rem;
  background-color: #fff;
  border: 0.0625rem solid #dadce0;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const FormText = styled.div`
  color: #7f7f7f;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`
const LogInfo = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
const JoinClassWrapper2 = styled.div`
  height: 48px;
  color: #5f6368;
  fill: #5f6368;
  display: flex;
  align-items: center;
`
const TopHead = styled.div`
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  font-size: 1.375rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: #80868b;
  margin-left: 1rem;
  display: block;
`
const JoinClass = (props) => {
  const { joinClassDialog, setJoinClassDialog } = props
  const [classCode, setClassCode] = useState('')

  const history = useHistory()
  const handleChangeClassCode = (e) => {
    setClassCode(e.target.value)
  }

  return (
    <Dialog
      fullScreen
      open={joinClassDialog}
      onClose={() => setJoinClassDialog(false)}
    >
      <Container>
        <JoinClassWrapper>
          <JoinClassWrapper2 onClick={() => setJoinClassDialog(false)}>
            <JoinClassIconClose />
          </JoinClassWrapper2>
          <TopHead>Join class</TopHead>
          <JoinClassBtn
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => history.push(`/classrooms/join?id=${classCode}`)}
          >
            Join
          </JoinClassBtn>
        </JoinClassWrapper>

        <JoinClassForm>
          <FormText>Class code</FormText>
          <LogInfo>
            <TextField
              id="outlined-basic"
              label="class-code"
              variant="outlined"
              onChange={handleChangeClassCode}
            />
          </LogInfo>
        </JoinClassForm>
      </Container>
    </Dialog>
  )
}

export default JoinClass
