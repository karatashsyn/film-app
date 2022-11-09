import Movies from './../components/Movie'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [movies, setmovies] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [categories, setCategories] = useState([])
  const [presentArtists, setPresentArtists] = useState([])
  const [categoriesAppeared, setCategoriesAppeared] = useState(false)
  const [buttonsPannelAppeared, setButtonsPannelAppeared] = useState(false)
  const [pannelCategoriesAppeared, setPannelCategoriesAppeared] = useState(false)
  const fetcArtists = async (queryString) => {
    fetch(`/artists/${queryString}`)
      .then((res) => res.json())
      .then((data) => {
        setPresentArtists(data)
      })
  }
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

  const searchMovies = (e) => {
    fetchMovies(searchKey.split(' ').join('+'))
  }

  const showHideCategories = () => {
    //active
    setCategoriesAppeared((prev) => !prev)
  }

  const bringAll = () => {
    fetchMovies('')
  }

  const showHideButtonsPannel = () => {
    //hidden-buttons-pannel
    setButtonsPannelAppeared((prev) => !prev)
  }

  const showHidePannelCategories = () => {
    setPannelCategoriesAppeared((prev) => !prev)
  }

  useEffect(() => {
    fetcGenres()
    fetchMovies(searchKey)
    fetcArtists('')
  }, [])
  // After we increased the width of the window. We should close the button-pannels. So I used the way below
  let widthMatch = window.matchMedia('(min-width: 564px)')
  widthMatch.addEventListener('change', () => {
    console.log('changed')
    if (widthMatch.matches) {
      if (buttonsPannelAppeared) {
        setButtonsPannelAppeared(false)
      }
    }
  })

  return (
    <div className="App">
      <div className="home-body">
        <div className="nav">
          <div className="buttons-pannel-icon" onClick={showHideButtonsPannel}></div>
          <div className={`buttons-pannel ${!buttonsPannelAppeared && 'hidden-buttons-pannel'}`}>
            <div className="pannel-all-movies-btn btn" onClick={bringAll}>
              All
            </div>
            <div
              className="add-movie-link"
              onClick={() => {
                navigate('/createmovie', {
                  state: { genres: categories, presentArtists: presentArtists },
                })
              }}
            >
              <div className="pannel-add-movie-button btn">Add</div>
            </div>
            <div
              className="pannel-categories-button btn"
              onClick={() => {
                showHidePannelCategories()
              }}
            >
              Categories
            </div>
            <div
              className={`pannel-categories-container ${
                !pannelCategoriesAppeared && 'hidden-pannel-categories-container'
              }`}
            >
              {categories.map((c) => (
                <div className="pannel-category-box" key={c.id}>
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          <div className="nav-buttons-container">
            <div className="categories-button" onMouseOver={showHideCategories}>
              Categories
            </div>
            <div className="all-movies-btn" onClick={bringAll}>
              All
            </div>

            <div
              className="add-movie-link"
              onClick={() => {
                navigate('/createmovie', {
                  state: { genres: categories, presentArtists: presentArtists },
                })
              }}
            >
              <div className="add-movie-button">Add</div>
            </div>
          </div>

          <input
            className="search-bar"
            type="text"
            onChange={(e) => {
              setSearchKey(e.target.value)
            }}
            onClick={showHideButtonsPannel}
          ></input>
          <button
            className="search-btn"
            onClick={() => {
              showHideButtonsPannel()
              searchMovies()
            }}
          >
            Search
          </button>
        </div>
        <div>
          <div
            onMouseLeave={showHideCategories}
            className={`categories ${categoriesAppeared && 'active'}`}
          >
            {categories.map((c) => (
              <div className="category-box" key={c.id}>
                {c.name}
              </div>
            ))}
          </div>
        </div>

        <div onClick={showHideButtonsPannel}>
          <Movies movies={movies} genres={categories} />
        </div>
      </div>
    </div>
  )
}

export default Home
