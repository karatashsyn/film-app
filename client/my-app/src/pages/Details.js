import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'

function Details() {
  const [currentMovie, setCurrentMovie] = useState({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const currentMovieId = useParams().movieId
  const [editMode, setEditMode] = useState(false)
  const [posterPath, setPosterPath] = useState()

  const fetchMovie = async () => {
    fetch(`/movie/${currentMovieId}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentMovie(data)
        setTitle(data.title)
        setDescription(data.description)
        setPosterPath(data.poster_path)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchMovie()
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

                  <div onClick={deleteMovie} className="delete-btn inactive-delete-movie"></div>
                </div>
              </div>
              <div className="genres">Adventure, Horror</div>
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
              <div className="artist">
                <div className="artist-photo"></div>
                <p className="artist-name">Some Actor</p>
              </div>
              <div className="artist">
                <div className="artist-photo"></div>
                <p className="artist-name">Some Actor</p>
              </div>
              <div className="artist add-artist hidden-add-btn">
                <div className="artist-photo"></div>
                <p className="artist-name"> ADD </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Details
