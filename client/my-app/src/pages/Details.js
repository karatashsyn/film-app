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
      <div className="fake-details-body">
        <img alt="bg" src={currentMovie.poster_path} className="blur-background"></img>
        <div className="main-container">
          <img alt="Movie Poster" src={currentMovie.poster_path} className="poster"></img>
          <div className="info-container">
            <div className="except-cast">
              <div className="first-row">
                <p className="title">{currentMovie.title}</p>
                <div className="buttons">
                  <div className="edit-btn">Edit</div>
                  <div className="delete-btn"></div>
                </div>
              </div>
              <div className="genres">Adventure, Horror</div>
              <div className="description-block">
                <p className="description-text">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus, repellat
                  facilis. Sapiente unde autem at, fuga modi qui fugiat ipsam laboriosam aspernatur
                  eaque ullam. Rerum voluptatum error libero reprehenderit quibusdam? Lorem, ipsum
                  dolor sit amet consectetur adipisicing elit. Repellendus, repellat facilis.
                  Sapiente unde autem at, fuga modi qui fugiat ipsam laboriosam aspernatur eaque
                  ullam. Rerum voluptatum error libero reprehenderit quibusdam?adipisicing elit.
                  Repellendus, repellat facilis. Sapiente unde autem at, fuga modi qui fugiat ipsam
                  laboriosam aspernatur eaque ullam. Rerum voluptatum error libero reprehenderit
                  quibusdam?m laboriosam aspernatur eaque ullam. Rerum voluptatum error libero
                  reprehenderit quibusdam?adipisicing elit. Repellendus, repellat facilis. Sapiente
                  unde autem at, fuga modi qui fugiat ipsam laboriosam aspernatur eaque ullam. Rerum
                  voluptatum error libero reprehenderit quibusdam?m laboriosam aspernatur eaque
                  ullam. Rerum voluptatum error libero reprehenderit quibusdam?adipisicing elit.
                  Repellendus, repellat facilis. Sapiente unde autem at, fuga
                </p>
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Details
