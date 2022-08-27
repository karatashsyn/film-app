import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import ArtistRows from '../components/ArtistRows'
import ArtistBoxes from '../components/ArtistBoxes'

function Details() {
  const currentMovieId = useParams().movieId
  const [currentMovie, setCurrentMovie] = useState({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [posterPath, setPosterPath] = useState()
  const [selectedCategory, setSelectedCategory] = useState()
  const [genres, setGenres] = useState('')
  const [searchedArtists, setSearchedArtists] = useState([])
  const [selectedArtists, setSelectedArtists] = useState([])
  const [preLoadedArtists, setPreLoadedArtistst] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [clicked, setClicked] = useState(false)

  const fetchMovie = async () => {
    fetch(`/movie/${currentMovieId}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentMovie(data)
        setTitle(data.title)
        setDescription(data.description)
        console.log(data.artists)
        setPreLoadedArtistst(data.artists)
        console.log(data.poster_path)
        data.poster_path === 'https://image.tmdb.org/t/p/w500null'
          ? setPosterPath('https://via.placeholder.com/200x300/808080/ffffff.jpeg?text=NO+IMAGE')
          : setPosterPath(data.poster_path)

        setGenres(data.genres.map((e) => `${e.name}`).join(', '))
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

  const searchArtists = () => {
    fetcArtists(searchKey.split(' ').join('+'))
  }

  useEffect(() => {
    fetchMovie()
    fetcArtists('')
    // del
  }, [])

  function changeReadonly() {
    const title = document.querySelector('.title')
    const description = document.querySelector('.description-text')
    console.log(title.getAttribute('readonly'))
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
    })
  }

  function deleteMovie() {
    axios.delete(`/movies/${currentMovieId}`)
  }

  function switchBetweenEditAndSave() {
    const editBtn = document.querySelector('.edit-btn')
    const deleteBtn = document.querySelector('.delete-btn')
    const addArtistBtn = document.querySelector('.add-artist')
    if (editMode === true) {
      setEditMode(false)
      editBtn.classList.remove('save-btn')
      editBtn.innerHTML = 'Edit'
      deleteBtn.classList.toggle('inactive-delete-movie')
      addArtistBtn.classList.toggle('hidden-add-btn')
      updateMovie()
    } else {
      setEditMode(true)
      editBtn.classList.toggle('save-btn')
      editBtn.innerHTML = 'Save'
      deleteBtn.classList.remove('inactive-delete-movie')
      addArtistBtn.classList.remove('hidden-add-btn')
    }
  }
  function editBtnFunctions() {
    changeReadonly()
    switchBetweenEditAndSave()
  }
  function openCloseArtistPannel() {
    const pannel = document.querySelector('.artist-pannel')
    if (pannel.classList.contains('hidden-artist-pannel')) {
      pannel.classList.remove('hidden-artist-pannel')
    } else {
      pannel.classList.toggle('hidden-artist-pannel')
    }
    // del
    // fetcArtists()
    // del
  }
  return (
    <>
      <div className="fake-details-body">
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
                    console.log(e.target.value)
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
              <div className="genres">{genres}</div>
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
              <ArtistBoxes artists={preLoadedArtists} />

              <div className="artist add-artist hidden-add-btn" onClick={openCloseArtistPannel}>
                <div className="artist-photo"></div>
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
                <button className="search-artist-btn" onClick={searchArtists}>
                  Search
                </button>
              </div>
              <ArtistRows artists={searchedArtists} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Details
