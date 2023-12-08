import { postDataApi } from '../../utils/fetchDataApi.js'
import { imageUpload } from '../../utils/imageUpload.js'
import { ALERT_TYPES } from './alertActions.js'

export const POST_TYPES = {
  CREATE_POST: 'CREATE_POST',
  LOADING_POST: 'LOADING_POST',
  GET_POSTS: 'GET_POSTS',
  UPDATE_POST: 'UPDATE_POST',
  GET_POST: 'GET_POST',
  DELETE_POST: 'DELETE_POST'
}

export const createPost = ({ content, images, auth }) => async (dispatch) => {
  let media
  try {
    // Show a loader while data is requested
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: { loading: true }
    })

    // Verify if images are available
    if (images) {
      media = await imageUpload([images])

      if (!media) {
        return dispatch({
          type: ALERT_TYPES.ALERT,
          payload: {
            error: 'La solicitud ha fallado'
          }
        })
      }
    } else {
      media = ''
    }

    // Post in DB
    // NOTE: The post body is provisionary, while token authorization is missing (user) property
    const res = await postDataApi('post', {
      user: auth.user,
      content,
      images: media
    }, auth.token)

    console.log(res)
    // dispatch({
    //   type: POST_TYPES.CREATE_POST,
    //   payload: { ...res.data.newPost, user: auth.user }
    // })

    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        loading: false
      }
    })
  } catch (err) {
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: { error: err.response.data.msg }
    })
  }
}
