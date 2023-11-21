import { combineReducers } from 'redux'
// import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import { alertReducer as alert } from './alertReducer.js'
import { authReducer as auth } from './authReducer.js'

export const rootReducers = combineReducers({
  auth,
  alert
})

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth']
// }

// export const persistedReducer = persistReducer(persistConfig, rootReducers)
