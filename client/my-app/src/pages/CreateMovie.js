import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './CreateMovie.css'
import CmCastArtists from '../components/CmCastArtists'
import CmPannelArtists from '../components/CmPannelArtists'
import CmGenreBox from '../components/CmGenreBox'

function CreateMovie() {
  const myLocation = useLocation()
  console.log(myLocation.state)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [posterPath, setPosterPath] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  console.log(myLocation.state)
  const [searchedArtists, setSearchedArtists] = useState(myLocation.state.presentArtists)
  const [selectedArtists, setSelectedArtists] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [artistAdded, setArtistAdded] = useState(false)
  const allGenres = myLocation.state.genres
  const [errors, setErrors] = useState([])

  function openCloseErrorPannel() {
    const errorPannel = document.querySelector('.error-pannel')
    const saveBtn = document.querySelector('.cm-save-movie-button')
    const addArtistBtn = document.querySelector('.cm-add-artist')
    errorPannel.classList.toggle('hidden-error-pannel')
    saveBtn.classList.toggle('inactive')
    addArtistBtn.classList.toggle('inactive')
  }

  function createMovie() {
    try {
      axios
        .post('/movies', {
          title: title,
          description: description,
          posterPath: posterPath,
          artistsIds: selectedArtists.map((a) => a.id),
          genresIds: selectedGenres.map((g) => g.id),
        })
        .then((res) => {
          if (res.status === 200) {
            window.location.replace('/')
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
    } catch (err) {
      console.log(err)
    }
  }

  function openCloseArtistPannel() {
    const pannel = document.querySelector('.cm-artist-pannel')
    pannel.classList.toggle('cm-hidden-artist-pannel')
  }

  function alreadyContains(listToBeChecked, elementToBeChecked) {
    if (listToBeChecked.map((e) => e.id).includes(elementToBeChecked.id)) {
      return true
    }
    return false
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

  return (
    <>
      <div className="error-pannel hidden-error-pannel">
        {errors.map((e) => (
          <p className="warning-row">{e}</p>
        ))}
        <div className="close-error-pannel-btn" onClick={openCloseErrorPannel}>
          Okay
        </div>
      </div>
      <div className="cm-body">
        <div className="cm-splitter">
          <div className="cm-container" id="cm-inputs-container">
            <input
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              placeholder="Title"
              className="cm-title"
              spellCheck="false"
              value={title}
            />

            <input
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              placeholder="Description"
              className="cm-description"
              spellCheck="false"
              value={description}
            />

            <input
              placeholder="Poster url"
              className="cm-poster-path"
              onChange={(e) => {
                setPosterPath(e.target.value)
              }}
            ></input>
          </div>

          <div className="cm-container" id="cm-relations-container">
            <h2>Categories</h2>
            <div className="cm-genres-pannel">
              <CmGenreBox
                allGenres={allGenres}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                alreadyContains={alreadyContains}
              />
            </div>
            <h2>Cast</h2>
            <div className="cm-cast">
              <CmCastArtists
                selectedArtists={selectedArtists}
                setSelectedArtists={setSelectedArtists}
              />

              <div className="cm-artist cm-add-artist " onClick={openCloseArtistPannel}>
                <div className="cm-remove-artist-btn-container cm-fake-remove-artist-btn-container">
                  {/* <div className="cm-remove-artist-btn">Delete</div> */}
                </div>
                <div className="cm-artist-photo cm-add-artist-photo"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="cm-container" id="cm-buttons-container">
          <div
            onClick={() => {
              createMovie()
            }}
            className="cm-save-movie-button"
            to={{ pathname: '/' }}
          >
            Save
          </div>

          <Link to={{ pathname: '/' }} className="cm-cancel-process-button">
            {' '}
            Cancel
          </Link>
        </div>

        <div className="cm-artist-pannel cm-hidden-artist-pannel">
          <div className="cm-search-artist-bar-container">
            <input
              placeholder="Search for artist"
              className="cm-search-artist-bar"
              type="text"
              onChange={(e) => {
                setSearchKey(e.target.value)
              }}
            ></input>
            <div className="cm-search-artist-button-container">
              <button className="cm-search-artist-btn" onClick={searchArtists}>
                Search
              </button>
              <button className="cm-cancel-btn" onClick={openCloseArtistPannel}>
                Close
              </button>
            </div>
          </div>
          <CmPannelArtists
            searchedArtists={searchedArtists}
            selectedArtists={selectedArtists}
            alreadyContains={alreadyContains}
            setSelectedArtists={setSelectedArtists}
            setArtistAdded={setArtistAdded}
            artistAdded={artistAdded}
          />
        </div>
      </div>
    </>
  )
}
export default CreateMovie
