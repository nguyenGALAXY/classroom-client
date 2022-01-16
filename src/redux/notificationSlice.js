import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { NOTIFICATION_STATUS } from 'src/utils/constants'
import axiosClient from '../axiosClient'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const response = await axiosClient.get('/api/notifications')
    return response.data
  }
)

export const updateNotifications = createAsyncThunk(
  'notifications/update',
  async (noti) => {
    const response = await axiosClient.put(
      `/api/notifications/${noti.id}/status`,
      noti
    )
    return response.data
  }
)

const initialState = {
  notifications: [],
}

const notificationsSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      state.notifications = action.payload
    },
    [updateNotifications.fulfilled]: (state, action) => {
      const updatedNoti = action.payload
      const updatedNotis = [...state.notifications]
      const updatedIndex = updatedNotis.findIndex(
        (n) => n.id === updatedNoti.id
      )
      updatedNotis[updatedIndex] = updatedNoti
      state.notifications = updatedNotis
    },
  },
})

const { actions, reducer } = notificationsSlice

export const { userLogin, userLogout, userSetRole } = actions

// selector
export const selectNotifications = (state) => state.notifications.notifications

export default reducer
