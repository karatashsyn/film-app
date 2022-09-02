import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ArtistDetails.css'

function ArtistDetails() {
  const currentArtistId = useParams().artistId
  const [currentArtist, setCurrentArtist] = useState({})

  useEffect(() => {
    fetch(`/artist/${currentArtistId}`)
      .then((res) => res.json())
      .then((data) => setCurrentArtist(data))
  }, [])

  return (
    <>
      <body className="ad-body">
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
      </body>
    </>
  )
}

export default ArtistDetails
