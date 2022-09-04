import Movies from './components/Movie'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import ArtistDetails from './pages/ArtistDetails'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import CreateMovie from './pages/CreateMovie'
axios.get('/addorupdategenres')
function App() {
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
