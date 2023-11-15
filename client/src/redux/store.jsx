import PropTypes from 'prop-types'

import { composeWithDevTools } from '@redux-devtools/extension'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
// import { persistedReducer } from './reducers/index.js'
import { rootReducers } from './reducers/index.js'

const store = configureStore({
  reducer: rootReducers,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production' ? composeWithDevTools() : false
})

// const persistor = persistStore(store)

export const DataProvider = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

DataProvider.propTypes = {
  children: PropTypes.any.isRequired
}

// A
