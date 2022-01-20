import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import get from 'lodash/get'
import axiosClient from '../axiosClient'

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await axiosClient.get('/api/user')
  return response.data
})
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (User, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put('/api/user', User)
      return response.data
    } catch (error) {
      return rejectWithValue(
        get(error, 'response.data.message', 'Error while updating user')
      )
    }
  }
)

const initialState = {
  user: {},
  isLogged: false,
  message: '',
  role: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.isLogged = true
      state.user = action.payload
    },
    userLogout: (state) => {
      state.user = undefined
      state.isLogged = false
      state.message = ''
      state.role = ''
    },
    userSetRole: (state, action) => {
      state.role = action.payload
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

export const { userLogin, userLogout, userSetRole } = actions

export default reducer
