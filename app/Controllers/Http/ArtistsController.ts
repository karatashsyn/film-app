import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { artistValidator } from 'App/utils/artistValidator'
import Artist from 'App/Models/Artist'
import fetch from 'node-fetch'
import Movie from 'App/Models/Movie'

export default class ArtistsController {
  // public async getArtists() {
  //   const allArtists = await Artist.all()
  //   return allArtists
  // }

  public async createArtist({ request }: HttpContextContract) {
    const payload = await request.validate({ schema: artistValidator.artistSchema })
    const artist = new Artist()
    artist.$attributes = { ...payload }
    await artist.save()
  }

  public async alreadyAdded(artist): Promise<boolean> {
    const targetArtist = await Artist.findBy('tmdb_id', artist.tmdbId)
    if (targetArtist) {
      console.log('You already have a movie with the same TMDB id ')
      return true
    } else {
      console.log('This is not added')
      return false
    }
  }

  public exactMatchINDB = async (name) => {
    const targetArtist = await Artist.findBy('name', name)
    if (!targetArtist) {
      console.log('No Match')
      return false
    }
    console.log('exact match')
    return true
  }

  public async addSingleArtistFromTMDB(queryString) {
    let tmdbArtist
    let artistId
    if (!queryString) {
      return
    }
    await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=d54de950ca880b236aa90854632983ca&query=${queryString}`
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
        tmdbArtist = data
      })
    const artistToBeAdded = new Artist()
    if (tmdbArtist) {
      artistToBeAdded.merge({
        tmdbId: tmdbArtist.id,
        name: tmdbArtist.name,
        biography: tmdbArtist.biography,
        profilePath: `https://image.tmdb.org/t/p/w500${tmdbArtist.profile_path}`,
        placeOfBirth: tmdbArtist.place_of_birth,
      })
      //Same logic with movie part
      if (await this.alreadyAdded(artistToBeAdded)) {
        console.log('You already have that artist')
        return { message: 'You already have that artist' }
      } else {
        console.log(artistToBeAdded.$attributes)
        await artistToBeAdded.save()
      }
    } else {
      console.log('There is no such artist')
      return { message: 'There is no such movie' }
    }

    return {
      name: tmdbArtist.name,
      tmdbId: tmdbArtist.id,
      biography: tmdbArtist.biography,
      profilePath: `https://image.tmdb.org/t/p/w500${tmdbArtist.profile_path}`,
      placeOfBirth: tmdbArtist.place_of_birth,
    }
  }

  public async getArtists({ request, response }: HttpContextContract) {
    let allArtists

    try {
      const queryString = request.param('search')
      const searchString: string = queryString ? queryString.split('+').join(' ') : ''
      //Check if there is the artist with the name which is exactly same with the searched name in our database. If not, go to TMDB and try to fetch. If does not exist there either, Do nothing
      let isMatching = await this.exactMatchINDB(searchString)
      if (!isMatching) {
        console.log(`Searching for artist ${queryString} in TMDB API`)
        await this.addSingleArtistFromTMDB(queryString)
      }
      allArtists = await Artist.query().where('name', 'REGEXP', `[a-zA-Z]*${searchString}[a-zA-Z]*`)

      return allArtists
    } catch (err) {
      response.json(err)
    }
  }
}
