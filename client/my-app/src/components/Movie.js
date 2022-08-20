import React, { useState, useEffect } from 'react'
import axios from 'axios'
function Movies() {
  const [movies, setmovies] = useState([])

  useEffect(() => {
    fetch('/movies')
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setmovies(data)
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  })

  return (
    <div>
      <div className="film-container">
        {movies.map((m) => (
          <div className="film-card">
            <img src={m.poster_path}></img>
            <h2 key={m.id}>{m.title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Movies
