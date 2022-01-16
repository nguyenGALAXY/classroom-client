import { configureStore } from '@reduxjs/toolkit'
import classroomsReducer from './redux/classroomsSlice'
import gradesReducer from './redux/gradeSlice'
import userReducer from './redux/userSlice'
import notificationsReducer from './redux/notificationSlice'

export const store = configureStore(
  {
    reducer: {
      classrooms: classroomsReducer,
      user: userReducer,
      grades: gradesReducer,
      notifications: notificationsReducer,
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
