import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import './MovieDetails.css'
const TMDB_NULL_IMG_URL = 'https://image.tmdb.org/t/p/w500null'
const NULL_IMG_PLACE_HOLDER = 'https://via.placeholder.com/200x300/808080/ffffff.jpeg?text=NO+IMAGE'
function MovieDetails() {
  const currentMovieId = useParams().movieId
  const [currentMovie, setCurrentMovie] = useState({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [posterPath, setPosterPath] = useState()
  const [selectedGenres, setSelectedGenres] = useState([])
  const [genresText, setGenresText] = useState('')
  const [searchedArtists, setSearchedArtists] = useState([])
  const [selectedArtists, setSelectedArtists] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [artistAdded, setArtistAdded] = useState(false)
  const [allGenres, setAllGenres] = useState([])
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
  const fetchGenres = async () => {
    fetch('/genres')
      .then((res) => res.json())
      .then((data) => {
        setAllGenres(data)
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
    fetchGenres()
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

  function changeReadonly() {
    const title = document.querySelector('.title')
    const description = document.querySelector('.description-text')
    if (!title.readOnly === true) {
      title.readOnly = true
      description.readOnly = true
    } else {
      title.readOnly = false
      description.readOnly = false
    }

    title.focus()
  }
  function updateMovie() {
    axios.patch(`/movies/${currentMovieId}`, {
      title: title,
      description: description,
      posterPath: posterPath,
      relatedArtistsIds: selectedArtists.map((a) => a.id),
      relatedGenresIds: selectedGenres.map((g) => g.id),
    })
  }

  function deleteMovie() {
    axios.delete(`/movies/${currentMovieId}`)
  }

  function switchBetweenEditAndSave() {
    const editBtn = document.querySelector('.edit-btn')
    const deleteBtn = document.querySelector('.delete-btn')
    const addArtistBtn = document.querySelector('.add-artist')
    const genresPannel = document.querySelector('.genres-pannel')
    const removeArtistbtns = Array.from(document.getElementsByClassName('remove-artist-btn'))
    console.log(removeArtistbtns)
    if (editMode === true) {
      setEditMode(false)
      editBtn.classList.remove('save-btn')
      editBtn.innerHTML = 'Edit'
      deleteBtn.classList.toggle('inactive-delete-movie')
      addArtistBtn.classList.toggle('hidden-add-btn')
      genresPannel.classList.toggle('hidden-genres-pannel')
      removeArtistbtns.forEach((element) => {
        element.classList.toggle('hidden-remove-artist-btn')
      })
      updateMovie()
    } else {
      setEditMode(true)
      editBtn.classList.toggle('save-btn')
      editBtn.innerHTML = 'Save'
      deleteBtn.classList.remove('inactive-delete-movie')
      addArtistBtn.classList.remove('hidden-add-btn')
      genresPannel.classList.remove('hidden-genres-pannel')
      removeArtistbtns.forEach((element) => {
        element.classList.remove('hidden-remove-artist-btn')
      })
    }
  }
  function editBtnFunctions() {
    changeReadonly()
    switchBetweenEditAndSave()
  }
  function openCloseArtistPannel() {
    const saveBtn = document.querySelector('.edit-btn')
    const deleteBtn = document.querySelector('.delete-btn')
    const pannel = document.querySelector('.artist-pannel')
    saveBtn.classList.toggle('nonclickable')
    deleteBtn.classList.toggle('nonclickable')
    pannel.classList.toggle('hidden-artist-pannel')
  }
  return (
    <>
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
                  <div onClick={editBtnFunctions} className="edit-btn">
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
                {allGenres.map((g) => (
                  <div
                    className="genre-box"
                    onClick={() => {
                      if (!selectedGenres.map((e) => e.id).includes(g.id)) {
                        setSelectedGenres([...selectedGenres, g])
                      } else {
                        setSelectedGenres(selectedGenres.filter((item) => item.id !== g.id))
                      }
                    }}
                    style={{
                      backgroundColor: selectedGenres.map((e) => e.id).includes(g.id)
                        ? '#0587ff'
                        : 'rgb(64,64,64)',
                    }}
                  >
                    {g.name}
                  </div>
                ))}
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
              {selectedArtists.map((e) => (
                <div className="artist">
                  <div className="remove-artist-btn-container">
                    <div
                      onClick={() => {
                        setSelectedArtists(selectedArtists.filter((item) => item.id !== e.id))
                      }}
                      className="remove-artist-btn hidden-remove-artist-btn"
                    >
                      Delete
                    </div>
                  </div>

                  <Link to={{ pathname: `/artist/${e.id}` }}>
                    <div
                      className="artist-photo"
                      style={{ backgroundImage: `url(${e.profile_path})` }}
                    ></div>
                  </Link>
                  <p className="artist-name">{e.name}</p>
                </div>
              ))}

              <div className="artist add-artist hidden-add-btn">
                <div className="remove-artist-btn-container">
                  <img
                    src="https://cdn.iconscout.com/icon/free/png-256/x-7-100307.png"
                    className="fake-remove-artist-btn"
                  ></img>
                </div>

                <div className="artist-photo" onClick={openCloseArtistPannel}></div>
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
              <>
                {searchedArtists.length >= 1 ? (
                  searchedArtists.map((a) => (
                    <div>
                      <div className="artist-container">
                        <div
                          onClick={() => {
                            if (!selectedArtists.map((artist) => artist.id).includes(a.id)) {
                              setSelectedArtists([...selectedArtists, a])
                            }
                            setArtistAdded(!artistAdded)
                          }}
                          className="artist-box"
                          style={{
                            pointerEvents: selectedArtists.map((artist) => artist.id).includes(a.id)
                              ? 'none'
                              : 'auto',
                          }}
                        >
                          <h3>
                            {selectedArtists.map((artist) => artist.id).includes(a.id)
                              ? `✔️  ${a.name}  `
                              : `${a.name}`}
                          </h3>
                          <img className="artist-box-image" src={a.profile_path}></img>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-result">No Result</div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default MovieDetails
