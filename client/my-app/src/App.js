import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import ArtistDetails from './pages/ArtistDetails'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import CreateMovie from './pages/CreateMovie'
import { useEffect, useState } from 'react'
import { genresAndArtistsActions, genreActions, relatedDataActions } from './store/index'
import { useDispatch } from 'react-redux'
import store from './store/index'
axios.get('/addorupdategenres')
function App() {
  const dispatch = useDispatch()
  const [presentArtists, setPresentArtists] = useState([])
  const [presentGenres, setPresentGenres] = useState([])
  const fetchPresentArtists = async () => {
    fetch(`/artists/`)
      .then((res) => res.json())
      .then((data) => {
        setPresentArtists(data)
      })
  }

  const fetchAllGenres = async () => {
    fetch('/genres')
      .then((res) => res.json())
      .then((data) => {
        setPresentGenres(data)
      })
  }
  useEffect(() => {
    fetchPresentArtists()
    fetchAllGenres()
  }, [])

  useEffect(() => {
    dispatch(relatedDataActions.updateArtists(presentArtists))
  }, [presentArtists, dispatch])

  useEffect(() => {
    dispatch(relatedDataActions.updategenres(presentGenres))
  }, [presentGenres, dispatch])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/details" element={<MovieDetails />}></Route>
          <Route path="/artist/" element={<ArtistDetails />}></Route>
          <Route path="/createmovie" element={<CreateMovie />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
