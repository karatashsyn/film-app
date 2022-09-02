import { Link, useNavigate } from 'react-router-dom'
function CastArtists({ selectedArtists, setSelectedArtists }) {
  const navigate = useNavigate()
  return (
    <>
      {selectedArtists.map((e) => (
        <div className="artist">
          <div className="remove-artist-btn-container">
            <div
              onClick={() => {
                setSelectedArtists(selectedArtists.filter((item) => item.id !== e.id))
              }}
              className="remove-artist-btn hidden-remove-artist-btn"
            >
              Delete
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/artist', { state: { artist: e } })
            }}
          >
            <div
              className="artist-photo"
              style={{ backgroundImage: `url(${e.profile_path})` }}
            ></div>
          </div>
          <p className="artist-name">{e.name}</p>
        </div>
      ))}
    </>
  )
}
export default CastArtists
