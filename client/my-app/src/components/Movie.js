import { useNavigate, Router } from 'react-router-dom'
const baseImageUrl = 'https://image.tmdb.org/t/p/w500'

function Movies(props) {
  const navigate = useNavigate()
  if (props.movies.length >= 1) {
    return (
      <div>
        <div className="film-container">
          {props.movies.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                navigate('/details', {
                  state: { movie: m, genres: props.genres },
                })
              }}
              className="film-card"
            >
              {m.poster_path === baseImageUrl ? (
                <img src="https://via.placeholder.com/200x300/808080/ffffff.jpeg?text=NO+IMAGE"></img>
              ) : (
                <img src={m.poster_path}></img>
              )}
              <h2 key={m.id}>{m.title}</h2>
            </div>
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
            <h2>No results</h2>
          </div>
        </div>
      </div>
    )
  }
}

export default Movies
