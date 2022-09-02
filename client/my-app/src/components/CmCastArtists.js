import { Link } from 'react-router-dom'
function CmCastArtists({ selectedArtists, setSelectedArtists }) {
  return (
    <>
      {selectedArtists.map((e) => (
        <div className="cm-artist">
          <div className="cm-remove-artist-btn-container">
            <div
              onClick={() => {
                setSelectedArtists(selectedArtists.filter((item) => item.id !== e.id))
              }}
              className="cm-remove-artist-btn hidden-remove-artist-btn"
            >
              Delete
            </div>
          </div>

          <div
            className="cm-artist-photo"
            style={{ backgroundImage: `url(${e.profile_path})` }}
          ></div>
        </div>
      ))}
    </>
  )
}
export default CmCastArtists
