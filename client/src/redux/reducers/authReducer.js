// import { createSlice } from '@reduxjs/toolkit'
import { TYPES } from '../actions/authActions.js'

const initialState = {}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.AUTH:
      return action.payload
    default:
      return state
  }
}

// export const selectAuth = (state) => state.auth
// export const selectToken = (state) => console.log(state.auth)

// const initialToken = {}

// export const tokenSlices = createSlice({
//   name: 'tokenReducer',
//   initialState: initialToken,
//   reducers: {
//     setToken: (state, action) => {
//       state.token = action.payload.token
//     }
//   }

// })

// export const { setToken } = tokenSlices.actions
// export const selectToken = (state) => state.token
// export default tokenSlices.reducer
