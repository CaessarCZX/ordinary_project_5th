import { validateRegisterData } from '../../services/login/index.js'
import { postDataApi } from '../../utils/fetchDataApi.js'
// import { setToken } from '../reducers/authReducer.js'
import { ALERT_TYPES } from './alertActions.js'

export const AUTH_TYPES = {
  AUTH: 'AUTH'
}

export const login = (credentialAccess) => async (dispatch) => {
  try {
    // Dispatcher for loader
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        loading: true
      }
    })

    // Get user data from back-end
    const { data } = await postDataApi('login', credentialAccess)
    dispatch({
      type: AUTH_TYPES.AUTH,
      payload: {
        token: data.accessToken,
        user: data.user
      }
    })

    // Set login var such as TRUE
    localStorage.setItem('login', true)

    // Show alert to client
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        success: data.msg
      }
    })
  } catch (err) {
    // Show error message to client
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        error: err.response.data.msg
      }
    })
  }
}

export const refreshToken = () => async (dispatch) => {
  const login = localStorage.getItem('login')
  if (login) {
    // Dispatcher for loader
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        loading: true
      }
    })

    try {
      // Get the cookie from back-end
      const { data } = await postDataApi('refresh_token')
      dispatch({
        type: AUTH_TYPES.AUTH,
        payload: {
          token: data.accessToken,
          user: data.user
        }
      })

      // // update token
      // dispatch(
      //   setToken({ token: data.accessToken })
      // )

      // Show alert to client
      dispatch({
        type: ALERT_TYPES.ALERT,
        payload: {
          success: data.msg
        }
      })
    } catch (err) {
      // Show error message to client
      dispatch({
        type: ALERT_TYPES.ALERT,
        payload: {
          error: err.response?.data?.msg,
          badConnection: true
        }
      })
    }
  }
}

export const register = (registerData) => async (dispatch) => {
  const checkData = validateRegisterData(registerData)
  if (checkData.errorLength > 0) {
    return dispatch({
      type: ALERT_TYPES.ALERT,
      payload: checkData.errorMsg
    })
  }

  try {
    // Dispatcher for loader
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        loading: true
      }
    })

    // Send user data to back-end and get response
    const { data } = await postDataApi('register', registerData)
    dispatch({
      type: AUTH_TYPES.AUTH,
      payload: {
        token: data.accessToken,
        user: data.user
      }
    })

    // Set first login var such as TRUE
    localStorage.setItem('login', true)

    // Show alert to client
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        success: data.msg
      }
    })
  } catch (err) {
    // Show error message to client
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        error: err.response.data.msg
      }
    })
  }
}

export const logout = () => async (dispatch) => {
  try {
    // dispatcher for loader in Out
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        loaderOut: true
      }
    })

    localStorage.removeItem('login')

    await postDataApi('logout')
    window.location.reload()
  } catch (err) {
    // Show error message to client
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        error: err.response.data.msg
      }
    })
  }
}
