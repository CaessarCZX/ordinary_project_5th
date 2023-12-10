import { DeleteData, EditData } from '../actions/alertActions.js'
import { POST_TYPES } from '../actions/postActions.js'

const initialState = {
  loading: false,
  posts: [],
  results: 0,
  page: 2
}

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES.CREATE_POST:
      return {
        ...state,
        posts: [...state.posts, action.payload]
      }
    case POST_TYPES.LOADING_POST:
      return {
        ...state,
        loading: action.payload
      }
    case POST_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        results: action.payload.result
        // page: action.payload.page
      }
    case POST_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: EditData(state.posts, action.payload._id, action.payload)
      }
    case POST_TYPES.DELETE_POST:
      return {
        ...state,
        posts: DeleteData(state.posts, action.payload._id)
      }
    default:
      return state
  }
}
