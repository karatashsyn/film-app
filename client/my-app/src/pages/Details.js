import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'

function Details() {
  const [currentMovie, setCurrentMovie] = useState({})
  const currentMovieId = useParams().movieId

  const fetchMovie = async () => {
    fetch(`/movie/${currentMovieId}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentMovie(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    fetchMovie()
  })

  console.log(currentMovieId)
  console.log(currentMovie)
  return (
    <>
      <h1>Heeeeyyyys</h1>
      <h1>{currentMovie.title}</h1>
    </>
  )
}
export default Details
