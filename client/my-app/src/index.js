import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import Movies from './components/Movie'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <div className="nav">
      <div className="categories-button"></div>
      <input className="search-bar"></input>
      <div className="add-movie-button"></div>
    </div>
    <div>
      <Movies />
    </div>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
