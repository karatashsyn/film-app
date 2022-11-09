import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import './CreateMovie.css'
import CmCastArtists from '../components/CmCastArtists'
import CmPannelArtists from '../components/CmPannelArtists'
import CmGenreBox from '../components/GenreBox'
import { relatedDataActions } from '../store'

function CreateMovie() {
  const presentArtists = useSelector((state) => state.relatedData.allArtists)
  const dispatch = useDispatch()
  const allGenres = useSelector((state) => state.relatedData.allGenres)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [posterPath, setPosterPath] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchedArtists, setSearchedArtists] = useState(presentArtists)
  const [selectedArtists, setSelectedArtists] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [artistAdded, setArtistAdded] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorPannelHidden, setErrorPannelHidden] = useState(true)
  const [hiddenArtistPannel, setHiddenArtistPannel] = useState(true)

  function openCloseErrorPannel() {
    setErrorPannelHidden((prev) => !prev)
  }

  function openCloseArtistPannel() {
    setHiddenArtistPannel((prev) => !prev)
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

  function alreadyContains(listToBeChecked, elementToBeChecked) {
    if (listToBeChecked.map((e) => e.id).includes(elementToBeChecked.id)) {
      return true
    }
    return false
  }

  const fetchArtists = async (queryString) => {
    if (searchKey === '') {
      fetchArtists(searchKey.split(' ').join('+'))
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
    fetchArtists(searchKey.split(' ').join('+'))
  }

  useEffect(() => {
    if (searchKey === '') {
      setSearchedArtists(presentArtists)
    }
  }, [presentArtists, searchKey])

  return (
    <>
      <div className={`error-pannel ${errorPannelHidden && 'hidden-error-pannel'}`}>
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
                isCmPage={true}
              />
            </div>
            <h2>Cast</h2>
            <div className="cm-cast">
              <CmCastArtists
                selectedArtists={selectedArtists}
                setSelectedArtists={setSelectedArtists}
              />

              <div
                className={`cm-artist cm-add-artist ${!errorPannelHidden && 'inactive'}`}
                onClick={openCloseArtistPannel}
              >
                <div className="cm-remove-artist-btn-container cm-fake-remove-artist-btn-container"></div>
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
            className={`cm-save-movie-button ${!errorPannelHidden && 'inactive'}`}
            to={{ pathname: '/' }}
          >
            Save
          </div>

          <Link to={{ pathname: '/' }} className="cm-cancel-process-button">
            {' '}
            Cancel
          </Link>
        </div>

        <div className={`cm-artist-pannel ${hiddenArtistPannel && 'cm-hidden-artist-pannel'}`}>
          <div className="cm-search-artist-bar-container">
            {/* <Route path="/"> */}
            <div>Hellloooo</div>
            {/* </Route> */}
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
