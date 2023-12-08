import { validateDataToEdit } from '../../services/edit-profile/index.js'
import { getDataApi, patchDataApi } from '../../utils/fetchDataApi.js'
import { imageUpload } from '../../utils/imageUpload.js'
import { ALERT_TYPES } from '../actions/alertActions'
import { AUTH_TYPES } from './authActions.js'

export const PROFILE_TYPES = {
  LOADING: 'LOADING',
  GET_USER: 'GET_USER',
  FOLLOW: 'FOLLOW',
  UNFOLLOW: 'UNFOLLOW'
}

export const getProfileUsers = ({ users, id, auth }) => async (dispatch) => {
  if (users.every(user => user._id !== id)) {
    try {
      // Show a loader in case the data is requested
      dispatch({
        type: PROFILE_TYPES.LOADING,
        payload: {
          loading: true
        }
      })

      // Get user data by id
      const { data } = await getDataApi(`user/${id}`, auth.token)

      dispatch({
        type: PROFILE_TYPES.GET_USER,
        payload: data
      })

      // Disable loader
      dispatch({
        type: PROFILE_TYPES.LOADING,
        payload: {
          loading: false
        }
      })
    } catch (err) {
      dispatch({
        type: ALERT_TYPES.ALERT,
        payload: err.response.data.msg
      })
    }
  }
}

export const updateProfile = ({ editData, newAvatar, auth }) => async (dispatch) => {
  const checkData = validateDataToEdit({ editData })

  if (checkData.errorLength > 0) {
    return dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        error: 'Uno o mas datos son incorrectos'
      }
    })
  }

  try {
    let media

    // Show a loader while data is requested
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        loading: true
      }
    })

    // Verify if newAvatar is available
    if (newAvatar) {
      media = await imageUpload([newAvatar])

      if (!media) {
        return dispatch({
          type: ALERT_TYPES.ALERT,
          payload: {
            error: 'La solicitud ha fallado'
          }
        })
      }
    }

    // Update user data
    const res = await patchDataApi('user', {
      ...editData,
      avatar: newAvatar ? media[0].secure_url : auth.user.avatar
    }, auth.token)

    dispatch({
      type: AUTH_TYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          ...editData,
          avatar: newAvatar ? media[0].secure_url : auth.user.avatar
        }
      }
    })

    // Show success message
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        success: res.data.msg
      }
    })
  } catch (err) {
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: err.response.data.msg
    })
  }
}

export const Follow = ({ users, currentUser, auth }) => async (dispatch) => {
  const updateFriendData = { ...currentUser, friends: [...currentUser.friends, auth.user] }

  // First to update in the app
  // 1: For current user profile
  dispatch({
    type: PROFILE_TYPES.FOLLOW,
    payload: updateFriendData
  })

  // 2: For current account logged
  dispatch({
    type: AUTH_TYPES.AUTH,
    payload: {
      ...auth,
      user: {
        ...auth.user,
        following: [...auth.user.following, updateFriendData]
      }
    }
  })

  // To update in DB
  try {
    // NOTE: The post body is provisionary, while token authorization is missing (._id) property
    const res = await patchDataApi(`user/${currentUser._id}/follow`, {
      _id: auth.user._id,
      followedUser: { ...currentUser }
    }, auth.token)

    // show message
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        success: res.data.msg
      }
    })
  } catch (err) {
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: err.response.data.msg
    })
  }
}

export const Unfollow = ({ users, currentUser, auth }) => async (dispatch) => {
  const updateFriendData = { ...currentUser, friends: currentUser.friends.filter(user => user._id !== auth.user._id) }

  // First to update in the app
  // 1: For current user profile
  dispatch({
    type: PROFILE_TYPES.UNFOLLOW,
    payload: updateFriendData
  })

  // 2: For current account logged
  dispatch({
    type: AUTH_TYPES.AUTH,
    payload: {
      ...auth,
      user: {
        ...auth.user,
        following: auth.user.following.filter(user => user._id !== currentUser._id)
      }
    }
  })

  // To update in DB
  try {
    // NOTE: The post body is provisionary, while token authorization is missing
    const res = await patchDataApi(`user/${currentUser._id}/unfollow`, {
      _id: auth.user._id,
      followedUser: { ...currentUser }
    }, auth.token)

    // show message
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        success: res.data.msg
      }
    })
  } catch (err) {
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: err.response.data.msg
    })
  }
}
