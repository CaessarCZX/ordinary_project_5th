import { PROFILE_TYPES } from '../actions/profileActions'

const initialState = {
  loading: false,
  users: [],
  posts: []
}

export const profileReducer = (state = initialState, action) => {
  const userStatus = {
    newUser: null,
    updateFollowUser: null,
    updateUnfollowUser: null
  }

  switch (action.type) {
    case PROFILE_TYPES.LOADING:
      return {
        ...state,
        loading: action.payload
      }

    case PROFILE_TYPES.GET_USER:
      userStatus.newUser = action.payload.user
      // To prevent duplicity
      if (!state.users.some(user => user._id === userStatus.newUser._id)) {
        return {
          ...state,
          users: [...state.users, userStatus.newUser]
        }
      }
      return state

    case PROFILE_TYPES.FOLLOW:
      userStatus.updateFollowUser = action.payload

      return {
        ...state,
        users: state.users.map(user => (
          user._id === userStatus.updateFollowUser._id ? userStatus.updateFollowUser : user
        ))
      }

    case PROFILE_TYPES.UNFOLLOW:
      userStatus.updateUnfollowUser = action.payload

      return {
        ...state,
        users: state.users.map(user => (
          user._id === userStatus.updateUnfollowUser._id ? userStatus.updateUnfollowUser : user
        ))
      }
    default:
      return state
  }
}
