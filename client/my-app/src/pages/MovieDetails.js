import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './MovieDetails.css'
import PannelArtists from '../components/MdPannelArtists'
import CastArtists from '../components/MdCastArtists'
import GenreBox from '../components/MdGenresBox'
const TMDB_NULL_IMG_URL = 'https://image.tmdb.org/t/p/w500null'
const NULL_IMG_PLACE_HOLDER = 'https://via.placeholder.com/200x300/808080/ffffff.jpeg?text=NO+IMAGE'

function MovieDetails() {
  const mylocation = useLocation()
  const currentMovieId = mylocation.state.movie.id
  const [currentMovie, setCurrentMovie] = useState(mylocation.state.movie)
  const [title, setTitle] = useState(currentMovie.title)
  const [description, setDescription] = useState(currentMovie.description)
  const [editMode, setEditMode] = useState(false)
  const [posterPath, setPosterPath] = useState('')
  const [selectedGenres, setSelectedGenres] = useState(currentMovie.genres)
  const [genresText, setGenresText] = useState(selectedGenres.map((e) => e.name).join(', '))
  const [searchedArtists, setSearchedArtists] = useState([])
  const [selectedArtists, setSelectedArtists] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [artistAdded, setArtistAdded] = useState(false)
  const [errors, setErrors] = useState([])
  const allGenres = mylocation.state.genres
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
    fetch(`/artists/${queryString}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchedArtists(data)
      })
  }

  useEffect(() => {
    setGenresText(selectedGenres.map((e) => `${e.name}`).join(', '))
  }, [selectedGenres])

  const searchArtists = () => {
    fetcArtists(searchKey.split(' ').join('+'))
  }

  useEffect(() => {
    fetchMovie()
    fetcArtists('')
  }, [])

  //Yeni artist ekleyince delete artist butonu initial olarak bu artiste hidden olarak geliyor.
  //Ancak artistleri duzenleme modundayken ekliyoruz ve duzenleme modundayken her artistin uzerinde
  // delete butonu olmali. Bu yuzden artist eklememize dependent olan bir effect ile yeni gelen
  // artistlerin de uzerinde delete butonu olmasini asagidaki effectle sagliyoruz.

  useEffect(() => {
    const removeArtistbtns = Array.from(document.getElementsByClassName('remove-artist-btn'))
    removeArtistbtns.forEach((element) => {
      element.classList.remove('hidden-remove-artist-btn')
    })
  }, [artistAdded])

  function changeReadonlyAndInnerTexts() {
    const editBtn = document.querySelector('.edit-btn')
    const title = document.querySelector('.title')
    const description = document.querySelector('.description-text')
    title.readOnly = !editMode
    description.readOnly = !editMode
    if (editMode) {
      editBtn.innerHTML = 'Save'
    } else {
      editBtn.innerHTML = 'Edit'
    }
    title.focus()
  }
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
          openCloseErrorPannel()
        }
      })
  }

  function deleteMovie() {
    axios.delete(`/movies/${currentMovieId}`)
  }

  useEffect(() => {
    changeReadonlyAndInnerTexts()
    const editBtn = document.querySelector('.edit-btn')
    const deleteBtn = document.querySelector('.delete-btn')
    const addArtistBtn = document.querySelector('.add-artist')
    const genresPannel = document.querySelector('.genres-pannel')
    const removeArtistbtns = Array.from(document.getElementsByClassName('remove-artist-btn'))
    editBtn.classList.toggle('save-btn')
    deleteBtn.classList.toggle('inactive-delete-movie')
    addArtistBtn.classList.toggle('hidden-add-btn')
    genresPannel.classList.toggle('hidden-genres-pannel')
    removeArtistbtns.forEach((element) => {
      element.classList.toggle('hidden-remove-artist-btn')
    })
    fetchMovie()
  }, [editMode])

  function openCloseArtistPannel() {
    const saveBtn = document.querySelector('.edit-btn')
    const deleteBtn = document.querySelector('.delete-btn')
    const pannel = document.querySelector('.artist-pannel')
    saveBtn.classList.toggle('nonclickable')
    deleteBtn.classList.toggle('nonclickable')
    pannel.classList.toggle('hidden-artist-pannel')
  }
  function openCloseErrorPannel() {
    const errorPannel = document.querySelector('.md-error-pannel')
    const editBtn = document.querySelector('.edit-btn')
    const addArtistBtn = document.querySelector('.add-artist')
    errorPannel.classList.toggle('md-hidden-error-pannel')
    editBtn.classList.toggle('inactive')
    addArtistBtn.classList.toggle('inactive')
  }
  return (
    <>
      <div className="md-error-pannel md-hidden-error-pannel">
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
                  readOnly={true}
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
                    className="edit-btn"
                  >
                    Edit
                  </div>
                  <Link
                    to={{ pathname: '/' }}
                    onClick={deleteMovie}
                    className="delete-btn inactive-delete-movie"
                  >
                    <div></div>
                  </Link>
                </div>
              </div>
              <div className="genres-text">{genresText}</div>
              <div className="genres-pannel hidden-genres-pannel">
                <GenreBox
                  allGenres={allGenres}
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                />
              </div>
              <div className="description-block">
                <textarea
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                  readOnly={true}
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
              />
              <div className="add-artist hidden-add-btn">
                <div className="remove-artist-btn-container hidden">
                  <div className="remove-artist-btn hidden-remove-artist-btn">Delete</div>
                </div>
                <div className="add-artist-photo" onClick={openCloseArtistPannel}></div>
                <p className="artist-name"> ADD </p>
              </div>
            </div>
            <div className="artist-pannel hidden-artist-pannel">
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
