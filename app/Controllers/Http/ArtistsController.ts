import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { artistValidator } from 'App/utils/artistValidator'
import Artist from 'App/Models/Artist'
import fetch from 'node-fetch'

export default class ArtistsController {
  public async getArtists() {
    const allArtists = await Artist.all()
    return allArtists
  }

  public async createArtist({ request }: HttpContextContract) {
    const payload = await request.validate({ schema: artistValidator.artistSchema })
    const artist = new Artist()
    artist.$attributes = { ...payload }
    await artist.save()
  }

  public async getArtistsFromTMDB(name) {
    let artistId
    let artist
    await fetch(
      'https://api.themoviedb.org/3/search/person?api_key=d54de950ca880b236aa90854632983ca&query=Jack+Nicholson'
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data)

        artistId = data.results[0].id
      })
    await fetch(
      `https://api.themoviedb.org/3/person/${artistId}?api_key=d54de950ca880b236aa90854632983ca&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        artist = data
      })
    return {
      name: artist.name,
      biography: artist.biography,
      profilePath: `https://image.tmdb.org/t/p/w500${artist.profile_path}`,
      placeOfBirth: artist.place_of_birth,
    }
  }
}
