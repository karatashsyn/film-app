function PannelArtists({
  searchedArtists,
  selectedArtists,
  setSelectedArtists,
  setArtistAdded,
  artistAdded,
}) {
  if (searchedArtists.length >= 1) {
    return (
      <>
        {searchedArtists.length >= 1 ? (
          searchedArtists.map((a) => (
            <div>
              <div className="artist-container">
                <div
                  className="artist-box"
                  onClick={() => {
                    if (!selectedArtists.map((artist) => artist.id).includes(a.id)) {
                      setSelectedArtists([...selectedArtists, a])
                    }
                    setArtistAdded(!artistAdded)
                  }}
                  style={{
                    pointerEvents: selectedArtists.map((artist) => artist.id).includes(a.id)
                      ? 'none'
                      : 'auto',
                  }}
                >
                  <h3>
                    {selectedArtists.map((artist) => artist.id).includes(a.id)
                      ? `✔️  ${a.name}  `
                      : `${a.name}`}
                  </h3>
                  <img className="artist-box-image" src={a.profile_path}></img>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-result">No Result</div>
        )}
      </>
    )
  } else {
    return <div className="no-result">No Result</div>
  }
}

export default PannelArtists
