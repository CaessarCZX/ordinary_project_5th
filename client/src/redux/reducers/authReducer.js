import { createSlice } from '@reduxjs/toolkit'
import { AUTH_TYPES } from '../actions/authActions.js'

// Reducer for Authentication in redux global store
const initialState = {}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_TYPES.AUTH:
      return action.payload
    default:
      return state
  }
}

export const selectAuth = (state) => state.auth

// Reducer for Token session, in Local storage
const initialToken = {
  token: ''
}

export const tokenSlice = createSlice({
  name: 'tokenSlice',
  initialState: initialToken,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token
    }
  }

})

export const { setToken } = tokenSlice.actions
export const selectToken = (state) => state.tokenState.token
export default tokenSlice.reducer
