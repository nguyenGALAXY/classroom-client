import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  Card,
  Box,
  Typography,
  TextField,
  CardContent,
  List,
  ListItem,
} from '@mui/material'
import Layout from 'src/Layout/Layout'
import GradeCard from './GradeCard'
const GradeStructure = [
  {
    id: '1',
    gradeTitle: 'Bai tap 1',
    gradeDetail: '1',
  },
  {
    id: '2',
    gradeTitle: 'Bai tap 2',
    gradeDetail: '2',
  },
  {
    id: '3',
    gradeTitle: 'Bai tap 3',
    gradeDetail: '1',
  },
  {
    id: '4',
    gradeTitle: 'Giua ky',
    gradeDetail: '3',
  },
  {
    id: '5',
    gradeTitle: 'Cuoi ky',
    gradeDetail: '4',
  },
]
const GradeAssignment = () => {
  const [listgrade, setListgrade] = useState(GradeStructure)

  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const item = Array.from(listgrade)
    const [reorderedItem] = item.splice(result.source.index, 1)
    item.splice(result.destination.index, 0, reorderedItem)
    setListgrade(item)
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
        <Card sx={{ minWidth: 650 }}>
          <CardContent>
            <Typography variant="h3">Grade Structure</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Edit your grade Structure
            </Typography>
          </CardContent>
        </Card>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="GradeCard">
            {(provided) => (
              <List
                className="GradeCard"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {listgrade.map((grades, index) => (
                  <Draggable
                    key={grades.id}
                    draggableId={grades.id}
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <GradeCard grade={grades} />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Layout>
  )
}
export default GradeAssignment
