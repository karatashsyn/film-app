import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import './MovieDetails.css'
import PannelArtists from '../components/MdPannelArtists'
import CastArtists from '../components/MdCastArtists'
import GenreBox from '../components/GenreBox'
import { relatedDataActions } from '../store/index'
const TMDB_NULL_IMG_URL = 'https://image.tmdb.org/t/p/w500null'
const NULL_IMG_PLACE_HOLDER = 'https://via.placeholder.com/200x300/808080/ffffff.jpeg?text=NO+IMAGE'

function MovieDetails() {
  const presentArtists = useSelector((state) => state.relatedData.allArtists)
  const allGenres = useSelector((state) => state.relatedData.allGenres)
  const mylocation = useLocation()
  const currentMovieId = mylocation.state.movie.id
  const [currentMovie, setCurrentMovie] = useState(mylocation.state.movie)
  const [title, setTitle] = useState(currentMovie.title)
  const [description, setDescription] = useState(currentMovie.description)
  const [editMode, setEditMode] = useState(false)
  const [posterPath, setPosterPath] = useState('')
  const [selectedGenres, setSelectedGenres] = useState(currentMovie.genres)
  const [genresText, setGenresText] = useState(selectedGenres.map((e) => e.name).join(', '))
  const [searchedArtists, setSearchedArtists] = useState(presentArtists)
  const [selectedArtists, setSelectedArtists] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [artistAdded, setArtistAdded] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorPannelAppeared, setErrorPannelAppeared] = useState(false)
  const [artistPannelAppeared, setArtistPannelAppeared] = useState(false)
  const dispatch = useDispatch()

  const fetchMovie = async () => {
    fetch(`/movie/${currentMovieId}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentMovie(data)
        setTitle(data.title)
        setDescription(data.description)
        setSelectedArtists(data.artists)
        data.poster_path === TMDB_NULL_IMG_URL
          ? setPosterPath(NULL_IMG_PLACE_HOLDER)
          : setPosterPath(data.poster_path)

        setGenresText(data.genres.map((e) => `${e.name}`).join(', '))
        setSelectedGenres(data.genres)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const fetcArtists = async (queryString) => {
    if (queryString === '') {
      setSearchedArtists(presentArtists)
    } else {
      fetch(`/artists/${queryString}`)
        .then((res) => res.json())
        .then((data) => {
          dispatch(relatedDataActions.updateArtists([...presentArtists, ...data]))
          setSearchedArtists(data)
        })
    }
  }

  const searchArtists = () => {
    fetcArtists(searchKey.split(' ').join('+'))
  }
  useEffect(() => {
    setGenresText(selectedGenres.map((e) => `${e.name}`).join(', '))
  }, [selectedGenres])

  useEffect(() => {
    if (searchKey === '') {
      setSearchedArtists(presentArtists)
    }
  }, [presentArtists, searchKey])

  useEffect(() => {
    fetchMovie()
  }, [])

  function updateMovie() {
    axios
      .patch(`/movies/${currentMovieId}`, {
        title: title,
        description: description,
        posterPath: posterPath,
        relatedArtistsIds: selectedArtists.map((a) => a.id),
        relatedGenresIds: selectedGenres.map((g) => g.id),
      })
      .then((res) => {
        if (res.status === 200) {
          return
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErrors(err.response.data.messages.errors.map((e) => e.message))
          errors.forEach((element) => {
            console.log(element)
          })
          fetchMovie()
          openCloseErrorPannel()
        }
      })
  }

  function deleteMovie() {
    axios.delete(`/movies/${currentMovieId}`)
  }

  function openCloseArtistPannel() {
    setArtistPannelAppeared((prev) => !prev)
  }

  function openCloseErrorPannel() {
    setErrorPannelAppeared((prev) => !prev)
  }
  return (
    <>
      <div className={`md-error-pannel ${!errorPannelAppeared && 'md-hidden-error-pannel'}`}>
        {errors.map((e) => (
          <p className="md-warning-row">{e}</p>
        ))}
        <div className="md-close-error-pannel-btn" onClick={openCloseErrorPannel}>
          Okay
        </div>
      </div>
      <div
        className="fake-details-body"
        style={{ backgroundImage: `url(${currentMovie.posterPath})` }}
      >
        <img alt="bg" src={currentMovie.poster_path} className="blur-background"></img>
        <div className="main-container">
          <img alt="Movie Poster" src={currentMovie.poster_path} className="poster"></img>
          <div className="info-container">
            <div className="except-cast">
              <div className="first-row">
                <input
                  readOnly={!editMode}
                  onChange={(e) => {
                    setTitle(e.target.value)
                  }}
                  className="title"
                  value={title}
                  spellCheck="false"
                />
                <div className="buttons">
                  <div
                    onClick={() => {
                      if (editMode) {
                        updateMovie()
                      }
                      setEditMode(!editMode)
                    }}
                    className={`edit-btn ${errorPannelAppeared && 'inactive'} ${
                      artistPannelAppeared && 'nonclickable'
                    }  ${editMode && 'save-btn'}`}
                  >
                    {editMode ? 'Save' : 'Edit'}
                  </div>
                  <Link
                    to={{ pathname: '/' }}
                    onClick={deleteMovie}
                    className={`delete-btn ${!editMode && 'inactive-delete-movie '} ${
                      artistPannelAppeared && 'nonclickable'
                    }`}
                  >
                    <div></div>
                  </Link>
                </div>
              </div>
              <div className="genres-text">{genresText}</div>
              <div className={`genres-pannel ${!editMode && 'hidden-genres-pannel'}`}>
                <GenreBox
                  allGenres={allGenres}
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                  isCmPage={false}
                />
              </div>
              <div className="description-block">
                <textarea
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                  readOnly={!editMode}
                  spellCheck="false"
                  className="description-text"
                  value={description}
                />
              </div>
            </div>
            <div className="cast">
              <CastArtists
                selectedArtists={selectedArtists}
                setSelectedArtists={setSelectedArtists}
                editMode={editMode}
              />
              <div className={`add-artist ${!editMode && 'hidden-add-btn'}`}>
                <div className="remove-artist-btn-container hidden">
                  <div className="remove-artist-btn hidden-remove-artist-btn">Delete</div>
                </div>
                <div className="add-artist-photo" onClick={openCloseArtistPannel}></div>
                <p className="artist-name"> ADD </p>
              </div>
            </div>
            <div className={`artist-pannel ${!artistPannelAppeared && 'hidden-artist-pannel'}`}>
              <div className="search-artist-bar-container">
                <input
                  placeholder="Search for artist"
                  className="search-artist-bar"
                  type="text"
                  onChange={(e) => {
                    setSearchKey(e.target.value)
                  }}
                ></input>
                <div className="search-artist-button-container">
                  <button className="search-artist-btn" onClick={searchArtists}>
                    Search
                  </button>
                  <button className="cancel-btn" onClick={openCloseArtistPannel}>
                    Close
                  </button>
                </div>
              </div>
              <PannelArtists
                searchedArtists={searchedArtists}
                selectedArtists={selectedArtists}
                setSelectedArtists={setSelectedArtists}
                artistAdded={artistAdded}
                setArtistAdded={setArtistAdded}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default MovieDetails
