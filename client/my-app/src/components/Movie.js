import { NavLink, Link, useParams, useLocation } from 'react-router-dom'
const baseImageUrl = 'https://image.tmdb.org/t/p/w500'

function Movies(props) {
  if (props.movies.length >= 1) {
    return (
      <div>
        <div className="film-container">
          {props.movies.map((m) => (
            <Link to={{ pathname: `/details/${m.id}`, state: { movie: m } }} className="film-card">
              {m.poster_path === 'https://image.tmdb.org/t/p/w500null' ? (
                <img src="https://via.placeholder.com/200x300/808080/ffffff.jpeg?text=NO+IMAGE"></img>
              ) : (
                <img src={m.poster_path}></img>
              )}
              <h2 key={m.id}>{m.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className="film-container">
          <div className=" no-such-movie">
            <img></img>
            <h2>We could not find anything.</h2>
          </div>
        </div>
      </div>
    )
  }
}

export default Movies
