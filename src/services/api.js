import axios from 'axios'

const api = axios.create({
  baseURL: 'https://vegmap-backend.herokuapp.com'
})

export default api