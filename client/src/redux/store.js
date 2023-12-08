import { composeWithDevTools } from '@redux-devtools/extension'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import { alertReducer as alert } from './reducers/alertReducer.js'
import tokenSlice, { authReducer as auth } from './reducers/authReducer.js'
import { profileReducer as profile } from './reducers/profileReducer.js'

const rootReducer = combineReducers({
  auth,
  alert,
  profile,
  tokenState: tokenSlice
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tokenState']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production' ? composeWithDevTools() : false
})

export const persistor = persistStore(store)
