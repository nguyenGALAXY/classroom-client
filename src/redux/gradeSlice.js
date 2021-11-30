import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosClient from '../axiosClient'

// export const addGrade = createAsyncThunk(
//   'classrooms/addGrade',
//   async (classroom) => {
//     const response = await axiosClient.post('api/grades', classroom)
//     return response.data
//   }
// )
export const arrangeGrade = createAsyncThunk(
  'classrooms/arrangeGrade',
  async (arg) => {
    const item = arg.item
    const response = await axiosClient.put(
      `api/classrooms/${arg.classroomId}/grades/arrange`,
      item
    )
    return response.data
  }
)
const initialState = {
  grades: [],
  classroomId: null,
}

const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    fetchGrades: (state, actions) => {
      state.grades = actions.payload.Grades
      state.classroomId = actions.payload.classroomId
    },
    updateGrades: (state, actions) => {
      state.grades = actions.payload
    },
    sortGrades: (state) => {
      if (state.grades) {
        state.grades = state.grades.sort((a, b) => a.index - b.index)
      }
    },
  },
  extraReducers: {
    [arrangeGrade.fulfilled]: (state, action) => {
      state.grades = action.payload
      state.grades = state.grades.sort((a, b) => a.index - b.index)
    },
  },
})

const { actions, reducer } = classroomsSlice

export const { updateGrades, fetchGrades, sortGrades } = actions

export default reducer
