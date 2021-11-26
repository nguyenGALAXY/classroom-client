import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosClient from '../axiosClient'

export const fetchClassrooms = createAsyncThunk(
  'classrooms/fetchClassrooms',
  async () => {
    const response = await axiosClient.get('api/classrooms')
    return response.data
  }
)

export const createClassroom = createAsyncThunk(
  'classrooms/createClassroom',
  async (classroom) => {
    const response = await axiosClient.post('api/classrooms', classroom)
    return response.data
  }
)
const initialState = {
  classrooms: [],
  isLoading: false,
}

const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    isLoading: (state) => {
      state.isLoading = true
    },
  },
  extraReducers: {
    [fetchClassrooms.fulfilled]: (state, action) => {
      state.classrooms = action.payload
      state.isLoading = false
    },
    [createClassroom.fulfilled]: (state, action) => {
      state.classrooms = [action.payload, ...state.classrooms]
    },
  },
})

const { actions, reducer } = classroomsSlice

export const { classroomsLoaded, isLoading } = actions

export default reducer
