import Movies from './components/Movie'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import ArtistDetails from './pages/ArtistDetails'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/details/:movieId" element={<MovieDetails />}></Route>
          <Route path="/artist/:artistId" element={<ArtistDetails />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
