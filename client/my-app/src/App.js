import './App.css'
import Movies from './components/Movie'
import { useState, useEffect } from 'react'

function App() {
  const [movies, setmovies] = useState([])

  useEffect((effect) => {
    fetch('/movies')
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setmovies(data)
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  })

  return (
    <div className="App">
      <div className="nav">
        <div className="categories-button"></div>
        <input className="search-bar"></input>
        <div className="add-movie-button"></div>
      </div>
      <div>
        <Movies movies={movies} />
      </div>
    </div>
  )
}

export default App
