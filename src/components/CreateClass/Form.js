import { Button, TextField, Typography, Box } from '@mui/material'
import React from 'react'

import { useState } from 'react'
const styleBtn = {
  alignItem: 'center',
  marginLeft: '150px',
  marginBottom: '15px',
}
export default function Form({ addClassroom }) {
  const [name, setName] = useState('')
  const [section, setSection] = useState('')
  const [subject, setSubject] = useState('')
  const [nameErr, setNameErr] = useState(false)
  const [sectionErr, setSectionErr] = useState(false)
  const [subjectErr, setSubjectErr] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setNameErr(false)
    setSectionErr(false)
    setSubjectErr(false)
    if (name === '') {
      setNameErr(true)
    }
    if (section === '') {
      setSectionErr(true)
    }
    if (subject === '') {
      setSubjectErr(true)
    }
    try {
      await addClassroom({ name, section, subject })
    } catch (err) {
      alert(err)
    }
  }

  const handleChangeName = (e) => {
    setName(e.target.value)
  }
  const handleChangeSection = (e) => {
    setSection(e.target.value)
  }
  const handleChangeSubject = (e) => {
    setSubject(e.target.value)
  }
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 3, width: '50ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div>
        <Typography variant="h5" color="secondary" align="center">
          Create Classroom
        </Typography>
        <TextField
          onChange={handleChangeName}
          label="Class name"
          variant="outlined"
          color="secondary"
          fullWidth
          required
          error={nameErr}
        />
        <TextField
          onChange={handleChangeSection}
          label="Section"
          variant="outlined"
          color="secondary"
          fullWidth
          required
          error={sectionErr}
        ></TextField>
        <TextField
          onChange={handleChangeSubject}
          label="Subject"
          variant="outlined"
          color="secondary"
          fullWidth
          required
          error={subjectErr}
        ></TextField>
      </div>
      <div style={styleBtn}>
        <Button color="secondary" variant="outlined" type="submit">
          Create class
        </Button>
      </div>
    </Box>
  )
}
