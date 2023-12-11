import axios from './axios'

export const getDataApi = async (url, token) => {
  const res = await axios.get(`http://localhost:8000/api/${url}`, {
    headers: { Authorization: token }
  })
  return res
}

export const postDataApi = async (url, post, token) => {
  const res = await axios.post(`http://localhost:8000/api/${url}`, post, {
    headers: { Authorization: token }
  })
  return res
}
export const putDataApi = async (url, post, token) => {
  const res = await axios.put(`http://localhost:8000/api/${url}`, post, {
    headers: { Authorization: token }
  })
  return res
}
export const patchDataApi = async (url, post, token) => {
  const res = await axios.patch(`http://localhost:8000/api/${url}`, post, {
    headers: { Authorization: token }
  })
  return res
}
export const deleteDataApi = async (url, token) => {
  const res = await axios.post(`http://localhost:8000/api/${url}`, {
    headers: { Authorization: token }
  })
  return res
}
