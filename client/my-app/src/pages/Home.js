import Movies from './../components/Movie'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const [movies, setmovies] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [categories, setCategories] = useState([])

  const fetchMovies = async (searchString) => {
    fetch(`/movies/${searchString}`)
      .then((res) => res.json())
      .then((data) => {
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
    fetchMovies(searchKey.split(' ').join('+'))
  }

  const showCategories = () => {
    const categoriesList = document.querySelector('.categories')
    categoriesList.classList.toggle('active')
  }
  const hideCategories = () => {
    const categoriesList = document.querySelector('.categories')
    categoriesList.classList.remove('active')
  }

  const bringAll = () => {
    fetchMovies('')
  }
  const showHideButtonsPannel = () => {
    const pannel = document.querySelector('.buttons-pannel')
    pannel.classList.toggle('hidden-buttons-pannel')
  }
  const hideButtonsPannel = () => {
    const pannel = document.querySelector('.buttons-pannel')
    pannel.classList.add('hidden-buttons-pannel')
  }
  const showHidePannelCategories = () => {
    const pannelCategories = document.querySelector('.pannel-categories-container')
    const pannelCategoriesBtn = document.querySelector('.pannel-categories-button')

    pannelCategories.classList.toggle('hidden-pannel-categories-container')
    pannelCategoriesBtn.classList.toggle('activated')
  }
  // After we increased the width of the window. We should close the button-pannels. So I used the way below
  let widthMatch = window.matchMedia('(min-width: 564px)')
  widthMatch.addEventListener('change', () => {
    console.log('changed')
    if (widthMatch.matches) {
      const pannel = document.querySelector('.buttons-pannel')
      if (!pannel.classList.contains('hidden-buttons-pannel')) {
        pannel.classList.add('hidden-buttons-pannel')
      }
    }
  })

  return (
    <div className="App">
      <div className="home-body">
        <div className="nav">
          <div className="buttons-pannel-icon" onClick={showHideButtonsPannel}></div>
          <div className="buttons-pannel hidden-buttons-pannel">
            <div className="pannel-all-movies-btn btn" onClick={bringAll}>
              All
            </div>
            <Link className="add-movie-link" to={{ pathname: '/createmovie' }}>
              <div className="pannel-add-movie-button btn">Add</div>
            </Link>
            <div
              className="pannel-categories-button btn"
              onClick={() => {
                showHidePannelCategories()
              }}
            >
              Categories
            </div>
            <div className="pannel-categories-container hidden-pannel-categories-container ">
              {categories.map((c) => (
                <div className="pannel-category-box" key={c.id}>
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          <div className="nav-buttons-container">
            <div className="categories-button" onMouseOver={showCategories}>
              Categories
            </div>
            <div className="all-movies-btn" onClick={bringAll}>
              All
            </div>

            <Link className="add-movie-link" to={{ pathname: '/createmovie' }}>
              <div className="add-movie-button">Add</div>
            </Link>
          </div>

          <input
            className="search-bar"
            type="text"
            onChange={(e) => {
              setSearchKey(e.target.value)
            }}
            onClick={hideButtonsPannel}
          ></input>
          <button
            className="search-btn"
            onClick={() => {
              hideButtonsPannel()
              searchMovies()
            }}
          >
            Search
          </button>
        </div>
        <div>
          <div onMouseLeave={hideCategories} className="categories">
            {categories.map((c) => (
              <div className="category-box" key={c.id}>
                {c.name}
              </div>
            ))}
          </div>
        </div>

        <div onClick={hideButtonsPannel}>
          <Movies movies={movies} />
        </div>
      </div>
    </div>
  )
}

export default Home
