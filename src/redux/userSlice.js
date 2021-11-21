import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosClient from '../axiosClient'

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await axiosClient.get('/api/user')
  return response.data
})
export const updateUser = createAsyncThunk('users/updateUser', async (User) => {
  const response = await axiosClient.put('api/user', User)
  return response.data
})

const initialState = {
  user: [],
  isLogged: false,
  message: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin: (state) => {
      state.isLogged = true
    },
    userLogout: (state) => {
      state.user = undefined
      state.isLogged = false
    },
  },
  extraReducers: {
    [fetchUser.fulfilled]: (state, action) => {
      state.user = action.payload
    },
    [updateUser.fulfilled]: (state, action) => {
      state.user = action.payload.user
      state.message = action.payload.message
    },
  },
})

const { actions, reducer } = userSlice

export const { userLogin, userLogout } = actions

export default reducer
