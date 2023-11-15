import { ALERT_TYPES } from '../actions/alertActions'

const initialState = {}

export const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERT_TYPES.ALERT:
      return action.payload
    default:
      return state
  }
}
