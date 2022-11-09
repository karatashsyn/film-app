import { configureStore, createSlice } from '@reduxjs/toolkit'

const initialState = { allGenres: [], allArtists: [] }
const fetchPresentArtists = async () => {
  fetch(`/artists/`)
    .then((res) => res.json())
    .then((data) => {
      initialState.allArtists = data
    })
}

const fetchAllGenres = async () => {
  fetch('/genres')
    .then((res) => res.json())
    .then((data) => {
      initialState.allGenres = data
    })
}
fetchAllGenres()
fetchPresentArtists()

const genresAndArtistsSlice = createSlice({
  name: 'genresandartists',
  initialState,
  reducers: {
    updategenres(state, action) {
      state.allGenres = action.payload
    },

    updateArtists(state, action) {
      state.allArtists = action.payload
    },
  },
})

const store = configureStore({
  reducer: { relatedData: genresAndArtistsSlice.reducer },
})

export const relatedDataActions = genresAndArtistsSlice.actions

export default store
