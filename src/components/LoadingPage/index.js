import { Grid, Container } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

export default function index() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    </Container>
  )
}
