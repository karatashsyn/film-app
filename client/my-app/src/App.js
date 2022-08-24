import Movies from './components/Movie'
import Home from './pages/Home'
import Details from './pages/Details'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/details/:movieId" element={<Details />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
