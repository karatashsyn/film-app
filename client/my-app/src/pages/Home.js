import Movies from './../components/Movie'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Categorie from '../components/Categorie'

function Home() {
  const [movies, setmovies] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [categories, setCategories] = useState([])

  const fetchMovies = async (searchString) => {
    fetch(`/movies/${searchString}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setmovies(data)
      })
  }

  const fetcGenres = async () => {
    fetch('/genres')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
      })
  }
  useEffect(() => {
    fetcGenres()
    fetchMovies(searchKey)
  }, [])

  const searchMovies = (e) => {
    fetchMovies(searchKey.replace(' ', '+'))
    console.log(searchKey.replace(' ', '+'))
  }

  const showCategories = () => {
    const categoriesList = document.querySelector('.categories')
    categoriesList.classList.toggle('active')
  }
  const hideCategories = () => {
    const categoriesList = document.querySelector('.categories')

    categoriesList.classList.remove('active')
  }
  return (
    <div className="App">
      <div className="nav">
        <div className="categories-button" onMouseOver={showCategories}>
          Categories
        </div>

        <input
          className="search-bar"
          type="text"
          onChange={(e) => {
            setSearchKey(e.target.value)
          }}
        ></input>
        <button onClick={searchMovies}>Search</button>
        <h1>{searchKey}</h1>
        <div className="add-movie-button"></div>
      </div>
      <Categorie onMouseLeave={hideCategories} categories={categories} />

      <div>
        <Movies movies={movies} />
      </div>
    </div>
  )
}

export default Home
