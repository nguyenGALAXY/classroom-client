import { Dialog } from '@mui/material'
import {
  fetchClassrooms,
  createClassroom,
  isLoading,
} from '../../redux/classroomsSlice'
import { useEffect } from 'react'
import Form from './Form'
import { useDispatch } from 'react-redux'

export default function CreateClass(props) {
  const { createClassDialog, setCreateClassDialog } = props
  const dispatch = useDispatch()
  const handleClose = () => {
    setCreateClassDialog(false)
  }

  const addClassroom = async ({ name, section, subject }) => {
    dispatch(
      createClassroom({ name: name, section: section, subject: subject })
    )
    handleClose()
  }
  useEffect(() => {
    async function fetchAPI() {
      dispatch(isLoading())
      dispatch(fetchClassrooms())
    }

    fetchAPI()
    handleClose()
  }, [dispatch])
  return (
    <>
      <div>
        <Dialog open={createClassDialog} maxWidth="xs" onClose={handleClose}>
          <Form addClassroom={addClassroom} />
        </Dialog>
      </div>
    </>
  )
}
