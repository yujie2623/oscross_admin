import axios from 'axios'
import { ElMessage } from 'element-plus';

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : '',
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => response.data,
  error => {
    console.log('err' + error)// for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
