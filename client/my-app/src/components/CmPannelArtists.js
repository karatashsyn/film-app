function CmPannelArtists({
  searchedArtists,
  selectedArtists,
  alreadyContains,
  setSelectedArtists,
  setArtistAdded,
  artistAdded,
}) {
  return (
    <>
      {searchedArtists.length >= 1 ? (
        searchedArtists.map((a) => (
          <div>
            <div className="cm-artist-container">
              <div
                onClick={() => {
                  if (!alreadyContains(selectedArtists, a)) {
                    setSelectedArtists([...selectedArtists, a])
                  }
                  setArtistAdded(!artistAdded)
                }}
                className="cm-artist-box"
                style={{
                  pointerEvents: alreadyContains(selectedArtists, a) ? 'none' : 'auto',
                }}
              >
                <h3>{alreadyContains(selectedArtists, a) ? `✔️  ${a.name}  ` : `${a.name}`}</h3>
                <img className="cm-artist-box-image" src={a.profile_path}></img>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="cm-no-result">No Result</div>
      )}
    </>
  )
}
export default CmPannelArtists
