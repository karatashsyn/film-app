import { useLocation } from 'react-router-dom'
import './ArtistDetails.css'

function ArtistDetails() {
  const mylocation = useLocation()
  const currentArtist = mylocation.state.artist

  return (
    <div className="ad-body">
      <div
        className="ad-blur-background"
        style={{ backgroundImage: `url(${currentArtist.profile_path})` }}
      ></div>
      <div className="ad-splitter">
        <section className="ad-section ad-basic-infos">
          <div className="ad-container">
            <img alt="Artist" className="ad-profile-photo" src={currentArtist.profile_path} />
            <h1 className="ad-name">{currentArtist.name}</h1>
            <h3 className="ad-place-of-birth">{currentArtist.place_of_birth}</h3>
          </div>
        </section>
        <section className="ad-section ad-biography">
          <div className="ad-biography ad-container">
            <p className="ad-biography-text">{currentArtist.biography}</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ArtistDetails
