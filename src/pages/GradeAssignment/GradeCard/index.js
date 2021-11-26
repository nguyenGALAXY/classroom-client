import React from 'react'
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/styles'
const FormButtonEdit = styled(Button)({
  padding: '30px 5px',
  borderRadius: '0px 4px 0px 0px',
})
const FormButtonRemove = styled(Button)({
  padding: '30px 3px',
  borderRadius: '0px 0px 4px 0px',
})
export default function GradeCard({ grade }) {
  const { gradeTitle, id, gradeDetail } = grade
  return (
    <Card sx={{ minWidth: 650, maxWidth: 650, m: 1 }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={10}>
          <CardContent>
            <TextField
              fullWidth
              variant="outlined"
              disabled={true}
              label="Grade Title"
              defaultValue={gradeTitle}
            ></TextField>
          </CardContent>
          <CardContent sx={{ marginTop: -2 }}>
            <TextField
              fullWidth
              variant="outlined"
              disabled={true}
              label="Grade Detail"
              defaultValue={gradeDetail}
            ></TextField>
          </CardContent>
        </Grid>
        <Grid item xs={1.5}>
          <FormButtonEdit variant="contained">
            <EditIcon />
          </FormButtonEdit>
          <FormButtonRemove color="error" fullWidth variant="contained">
            <DeleteIcon />
          </FormButtonRemove>
        </Grid>
      </Grid>
    </Card>
  )
}
