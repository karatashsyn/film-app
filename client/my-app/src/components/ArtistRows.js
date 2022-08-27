import { NavLink, Link, useParams, useLocation } from 'react-router-dom'
// const baseImageUrl = 'https://image.tmdb.org/t/p/w500'

function ArtistRows(props) {
  if (props.artists.length >= 1) {
    return (
      <div>
        <div className="artist-container">
          {props.artists.map((a) => (
            <div className="artist-box">
              <h3>{a.name}</h3>
              <img className="artist-box-image" src={a.profile_path}></img>
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className="artist-container">
        <div className="there-is-no-such-artist">There is no such artist</div>
      </div>
    )
  }
}

export default ArtistRows
