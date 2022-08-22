import './App.css'
import Movies from './components/Movie'
import { useState, useEffect } from 'react'

function App() {
  const [movies, setmovies] = useState([])
  const [searchKey, setSearchKey] = useState('')

  const fetchMovies = async (searchString) => {
    fetch(`/movies/${searchString}`)
      .then((res) => res.json())
      .then((data) => {
        setmovies(data)
      })
  }

  const searchMovies = (e) => {
    // e.preventdefault()
    fetchMovies(searchKey)
  }

  return (
    <div className="App">
      <div className="nav">
        <div className="categories-button"></div>
        <input
          className="search-bar"
          type="text"
          onChange={(e) => {
            setSearchKey(e.target.value)
          }}
          onSubmit={searchMovies}
        ></input>
        <button type={'submit'} onClick={searchMovies}>
          Search
        </button>
        <h1>{searchKey}</h1>
        <div className="add-movie-button"></div>
      </div>
      <div>
        <Movies movies={movies} />
      </div>
    </div>
  )
}

export default App
