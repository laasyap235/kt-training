import axios from 'axios'

const api = axios.create({
  baseURL: 'https://newwebapp-ddahc5atayhchzaa.eastasia-01.azurewebsites.net/api',
})

export default api
