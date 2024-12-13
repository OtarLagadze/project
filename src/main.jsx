import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MathJaxContext>
      <Provider store={store}>
        <App />
      </Provider>
    </MathJaxContext>
  </BrowserRouter>
)
