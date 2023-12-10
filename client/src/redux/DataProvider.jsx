import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store.js'

export const DataProvider = ({ children }) => {
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        {children}
      </Provider>
    </PersistGate>
  )
}

DataProvider.propTypes = {
  children: PropTypes.any.isRequired
}
