import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import { ThemeProvider } from './components/ThemeContext.jsx'
import { DataProvider } from './redux/DataProvider.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeProvider>
  </React.StrictMode>

)
