import { Link, useNavigate } from 'react-router-dom'
function GenreBox({ allGenres, selectedGenres, setSelectedGenres }) {
  return (
    <>
      {allGenres.map((g) => (
        <div
          className="genre-box"
          onClick={() => {
            if (!selectedGenres.map((e) => e.id).includes(g.id)) {
              setSelectedGenres([...selectedGenres, g])
            } else {
              setSelectedGenres(selectedGenres.filter((item) => item.id !== g.id))
            }
          }}
          style={{
            backgroundColor: selectedGenres.map((e) => e.id).includes(g.id)
              ? '#0587ff'
              : 'rgb(64,64,64)',
          }}
        >
          {g.name}
        </div>
      ))}
    </>
  )
}
export default GenreBox
