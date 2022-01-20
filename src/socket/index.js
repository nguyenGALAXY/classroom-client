import io from 'socket.io-client'
import { store } from 'src/store'
import { fetchNotifications } from 'src/redux/notificationSlice'

let socketClient = io(process.env.REACT_APP_API_URL)

socketClient.on('connect', () => {
  socketClient.on('notify', () => {
    store.dispatch(fetchNotifications())
  })
})

export const establishNewConnection = (userId) => {
  console.log('establish socket connection')
  socketClient.emit('new-user', userId)
}

export const disconnectSocket = () => {
  console.log('disconnect socket')
  socketClient.disconnect()
}

export default socketClient
