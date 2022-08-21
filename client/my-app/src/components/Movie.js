import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Movies(props) {
  return (
    <div>
      <div className="film-container">
        {props.movies.map((m) => (
          <div className="film-card">
            <h1>{m.id}</h1>
            <img src={m.poster_path}></img>
            <h2 key={m.id}>{m.title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Movies
