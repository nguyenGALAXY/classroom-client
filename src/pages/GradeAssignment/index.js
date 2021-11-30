import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  Card,
  Box,
  Typography,
  CardContent,
  List,
  ListItem,
  IconButton,
  Button,
  CardHeader,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import Layout from 'src/Layout/Layout'
import GradeCard from './GradeCard'
import { nanoid } from '@reduxjs/toolkit'
import styled from '@emotion/styled'
import axiosClient from 'src/axiosClient'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router'
import { ArrowBackIosNew } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { arrangeGrade, updateGrades } from 'src/redux/gradeSlice'

const CustomCard = styled(Card)`
  &.sticky {
    position: sticky;
    top: 10px;
    z-index: 2;
  }
`

const GradeAssignment = () => {
  const classroomGrades = useSelector((state) => state.grades)
  const [listgrade, setListgrade] = useState(classroomGrades.grades)
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const item = Array.from(listgrade)
    const [reorderedItem] = item.splice(result.source.index, 1)
    item.splice(result.destination.index, 0, reorderedItem)
    setListgrade(item)
    dispatch(
      arrangeGrade({
        item,
        classroomId: classroomGrades.classroomId,
      })
    )
  }

  const goBack = () => {
    history.goBack()
  }

  const addNewAssignment = () => {
    const newAssignment = {
      id: nanoid(),
      name: '',
      point: '',
      isNew: true,
      index: listgrade.length,
    }
    setListgrade((prevState) => [...prevState, newAssignment])
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosClient.get(`/api/classrooms/${id}/grades`)
      setListgrade(response.data.sort((a, b) => a.index - b.index))
    }

    fetchData()
  }, [])

  const updateAssignment = (id, newAssignment) => {
    setListgrade((prevState) => {
      const newAssignments = [...prevState]
      let index = newAssignments.findIndex((assignment) => assignment.id === id)
      newAssignments[index] = newAssignment
      return newAssignments
    })
  }

  const deleteAssignment = (id) => {
    setListgrade((prevState) =>
      prevState.filter((assignment) => assignment.id !== id)
    )
  }

  return (
    <Layout>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CustomCard sx={{ minWidth: 650 }} className={`sticky`}>
          <CardHeader
            avatar={
              <IconButton onClick={goBack}>
                <ArrowBackIosNew />
              </IconButton>
            }
            title={<Typography variant="h3">Grade Structure</Typography>}
          />
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Edit your grade Structure
            </Typography>
            <Button onClick={addNewAssignment}>
              <AddIcon /> Add New Assignment
            </Button>
          </CardContent>
        </CustomCard>
        <div>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="GradeCard">
              {(provided) => (
                <List
                  className="GradeCard"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {listgrade.map((assignment, index) => (
                    <Draggable
                      key={assignment.id}
                      draggableId={assignment.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <ListItem
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <GradeCard
                            grade={assignment}
                            updateAssignment={updateAssignment}
                            deleteAssignment={deleteAssignment}
                          />
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Box>
    </Layout>
  )
}
export default GradeAssignment
