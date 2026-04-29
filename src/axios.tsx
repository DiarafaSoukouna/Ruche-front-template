import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://test-api.adtpme.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})
