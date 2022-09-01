import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './CreateMovie.css'

function CreateMovie() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [posterPath, setPosterPath] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchedArtists, setSearchedArtists] = useState([])
  const [selectedArtists, setSelectedArtists] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [artistAdded, setArtistAdded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [allGenres, setAllGenres] = useState([])

  function createMovie() {
    axios.post('/movies', {
      title: title,
      description: description,
      posterPath: posterPath,
      artistsIds: selectedArtists.map((a) => a.id),
      genresIds: selectedGenres.map((g) => g.id),
    })
  }
  function openCloseArtistPannel() {
    const pannel = document.querySelector('.cm-artist-pannel')
    if (pannel.classList.contains('cm-hidden-artist-pannel')) {
      pannel.classList.remove('cm-hidden-artist-pannel')
    } else {
      pannel.classList.toggle('cm-hidden-artist-pannel')
    }
  }

  function alreadyContains(listToBeChecked, elementToBeChecked) {
    if (listToBeChecked.map((e) => e.id).includes(elementToBeChecked.id)) {
      return true
    }
    return false
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

  const searchArtists = () => {
    fetcArtists(searchKey.split(' ').join('+'))
  }

  useEffect(() => {
    fetchGenres()
    fetcArtists('')
  }, [])

  //Yeni artist ekleyince delete artist butonu initial olarak bu artiste hidden olarak geliyor.
  //Ancak artistleri duzenleme modundayken ekliyoruz ve duzenleme modundayken her artistin uzerinde
  // delete butonu olmali. Bu yuzden artist eklememize dependent olan bir effect ile yeni gelen
  // artistlerin de uzerinde delete butonu olmasini asagidaki effectle sagliyoruz.
  useEffect(() => {
    const removeArtistbtns = Array.from(document.getElementsByClassName('cm-remove-artist-btn'))
    removeArtistbtns.forEach((element) => {
      if (element.classList.contains('cm-hidden-remove-artist-btn')) {
        element.classList.remove('cm-hidden-remove-artist-btn')
      } else {
        element.classList.toggle('cm-hidden-remove-artist-btn')
      }
    })
  }, [artistAdded])

  useEffect(() => {
    createMovie()
  }, [saved])

  return (
    <>
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
              {allGenres.map((g) => (
                <div
                  className="cm-genre-box"
                  onClick={() => {
                    if (!alreadyContains(selectedGenres, g)) {
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
            <h2>Cast</h2>
            <div className="cm-cast">
              {selectedArtists.map((e) => (
                <div className="cm-artist">
                  <div className="cm-remove-artist-btn-container">
                    <div
                      onClick={() => {
                        setSelectedArtists(selectedArtists.filter((item) => item.id !== e.id))
                      }}
                      className="cm-remove-artist-btn cm-hidden-remove-artist-btn"
                    >
                      Delete
                    </div>
                  </div>

                  <div
                    className="cm-artist-photo"
                    style={{ backgroundImage: `url(${e.profile_path})` }}
                  ></div>

                  {/* <p className="cm-artist-name">{e.name}</p> */}
                </div>
              ))}

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
          <Link
            onClick={() => setSaved(!saved)}
            className="cm-save-movie-button"
            to={{ pathname: '/' }}
          >
            Save
          </Link>

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
          <>
            {searchedArtists.length >= 1 ? (
              searchedArtists.map((a) => (
                <div>
                  <div className="cm-artist-container">
                    <div
                      onClick={() => {
                        if (!alreadyContains(selectedArtists, a)) {
                          setSelectedArtists([...selectedArtists, a])
                        }
                        setArtistAdded(!artistAdded)
                      }}
                      className="cm-artist-box"
                      style={{
                        pointerEvents: alreadyContains(selectedArtists, a) ? 'none' : 'auto',
                      }}
                    >
                      <h3>
                        {alreadyContains(selectedArtists, a) ? `✔️  ${a.name}  ` : `${a.name}`}
                      </h3>
                      <img className="cm-artist-box-image" src={a.profile_path}></img>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="cm-no-result">No Result</div>
            )}
          </>
        </div>
      </div>
    </>
  )
}
export default CreateMovie
