import { patchDataApi, postDataApi } from '../../utils/fetchDataApi.js'
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

    dispatch({
      type: POST_TYPES.CREATE_POST,
      payload: { ...res.data.newPost, user: auth.user }
    })

    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        success: res.data.msg
      }
    })
  } catch (err) {
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: { error: err.response.data.msg }
    })
  }
}

export const getPosts = (auth) => async (dispatch) => {
  try {
    const user = auth.user
    // Show loader to the client while data isnt available
    dispatch({
      type: POST_TYPES.LOADING_POST,
      payload: true
    })

    const res = await postDataApi('posts', {
      user
    }, auth.token)

    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: res.data
    })

    dispatch({
      type: POST_TYPES.LOADING_POST,
      payload: false
    })
  } catch (err) {
    console.error('Datos aun por cargar...')
  }
}

export const updatePost = ({ content, images, status, auth }) => async (dispatch) => {
  // const currentPostImg = status?.images[0]
  const currentPostContent = status.content
  const isAlreadyUploaded = !!(images.secure_url)

  if (currentPostContent === content) {
    return dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        error: 'La publicación no se ha actualizado'
      }
    })
  }

  let media
  try {
    // Show a loader while data is requested
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: { loading: true }
    })

    // Check is the image is uploaded
    if (!isAlreadyUploaded) {
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
    } else {
      media = images
    }

    // Pathc in DB
    const res = await patchDataApi(`post/${status._id}`, {
      content,
      images: media
    }, auth.token)
    console.log(res)

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: res.data.newPost
    })

    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {
        success: res.data.msg
      }
    })
  } catch (err) {
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: { error: err.response.data.msg }
    })
  }
}

export const likePosts = ({ post, auth }) => async (dispatch) => {

}

export const unlikePosts = ({ post, auth }) => async (dispatch) => {

}
