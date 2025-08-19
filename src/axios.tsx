import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://adsms.simro-cmr.net/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})
