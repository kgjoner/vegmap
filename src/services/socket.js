import socketio from 'socket.io-client'

const baseURL = process.env.NODE_ENV === 'development' ? 
'http://localhost:3030' : 'https://vegmap-backend.herokuapp.com'

const socket = socketio(baseURL,  {
  transports: ['websocket'],
  autoConnect: false
})

function subscribeToNewRestaurant(subscribeFunction) {
  socket.on('new-restaurant', subscribeFunction)
}

function subscribeToUpdateRestaurant(subscribeFunction) {
  socket.on('update-restaurant', subscribeFunction)
}

function connect(params) {
  socket.io.opts.query = params
  socket.connect()
}

function disconnect() {
  if(socket.connected) {
    socket.disconnect()
  }
}

export { connect, disconnect, subscribeToNewRestaurant, subscribeToUpdateRestaurant }