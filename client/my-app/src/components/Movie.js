import { NavLink, Link, useParams, useLocation } from 'react-router-dom'

function Movies(props) {
  return (
    <div>
      <div className="film-container">
        {props.movies.map((m) => (
          <Link to={{ pathname: `/details/${m.id}`, state: { movie: m } }} className="film-card">
            <img src={m.poster_path}></img>
            <h2 key={m.id}>{m.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Movies
