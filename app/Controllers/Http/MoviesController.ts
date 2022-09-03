import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { movieValidator } from 'App/utils/movieValidator'
import Movie from 'App/Models/Movie'
import fetch from 'node-fetch'
import DeletedMovie from 'App/Models/DeletedMovie'
const TMDB_SEARCH_MOVIE_BASE_URL =
  'https://api.themoviedb.org/3/search/movie?api_key=d54de950ca880b236aa90854632983ca&query='

export default class MoviesController {
  public async alreadyAdded(tmdbmovie): Promise<boolean> {
    const targetMovie = await Movie.findBy('tmdb_id', tmdbmovie.id)
    if (targetMovie) {
      console.log('You already have a movie with the same TMDB id ')
      return true
    } else {
      console.log('This is not added')
      return false
    }
  }

  public exactMatchINDB = async (title) => {
    const targetMovie = await Movie.findBy('title', title)
    if (!targetMovie) {
      console.log('No Match')
      return false
    }
    console.log('exact match')
    return true
  }
  public async isDeleted(movieTmdbId) {
    const targetMovie = await DeletedMovie.findBy('tmdb_id', movieTmdbId)
    if (targetMovie) {
      return true
    } else {
      return false
    }
  }
  //Info Decoder coming from url which contains infos for the purpose of adding relation between Movie and Artist
  public pairInfoEncoder(infoString) {
    const pairs = infoString.split('&')
    const movieArtistIdPairs = { movieId: pairs[0].split('=')[1], artistId: pairs[1].split('=')[1] }
    return movieArtistIdPairs
  }

  public async addSingleMovieFromTMDB(queryString) {
    let TMDbMovie
    let TMDBMovieGenreIds
    if (queryString) {
      await fetch(`${TMDB_SEARCH_MOVIE_BASE_URL}${queryString}`)
        .then((res) => res.json())
        .then((data) => {
          TMDbMovie = data.results[0]
          TMDBMovieGenreIds = TMDbMovie.genre_ids
        })
    }

    const movieToBeAdded = new Movie()
    //We said that as a result of not finding exact match, we should go to the TMDB and discover the closest match by the search string
    //But it is possible to add same film. For instance, Let us assume that we have 'dark blood' in our DB. And we typed 'dark blo'.
    //Since there is not exact match, backend will try to find a movie on tmdb (Which will be dark blood in this case) and try to push it into our DB.
    // In order to prevent duplicate films, we should check if we have the film with the same TMDB_id
    if (TMDbMovie) {
      if (await this.alreadyAdded(TMDbMovie)) {
        return { message: 'You already have that film' }
      } else {
        movieToBeAdded.merge({
          title: TMDbMovie.title,
          tmdbId: TMDbMovie.id,
          description: TMDbMovie.overview,
          posterPath: 'https://image.tmdb.org/t/p/w500' + TMDbMovie.poster_path,
        })
        if (!(await this.isDeleted(movieToBeAdded.tmdbId))) {
          await movieToBeAdded.save()
          Movie.$getRelation('genres')?.boot()
          await movieToBeAdded.related('genres').sync(TMDBMovieGenreIds)
          return movieToBeAdded.$attributes
        }
      }
    } else {
      console.log('There is no such movie')
      return { message: 'There is no such movie' }
    }
  }

  public async FetchIfNotEnough() {
    let pageNumber = 1
    let totalMovieNumber = (await Movie.all()).length
    while (totalMovieNumber < 72) {
      try {
        let currentPage
        await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=d54de950ca880b236aa90854632983ca&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`
        )
          .then((res) => res.json())
          .then((data) => {
            currentPage = data.results
          })
        currentPage.forEach(async (element) => {
          if (!(await this.alreadyAdded(element)) && !(await this.isDeleted(element.id))) {
            console.log('conditions are okay')
            let movie = new Movie()
            movie.merge({
              title: element.title,
              tmdbId: element.id,
              description: element.overview,
              posterPath: 'https://image.tmdb.org/t/p/w500' + element.poster_path,
            })

            await movie.save().then(() => {
              totalMovieNumber++
            })
            console.log(element)
            console.log(element.genre_ids)
            element.genre_ids.forEach(async (gId) => {
              await movie.related('genres').attach([gId])
            })
            // await movie.related('genres').sync(element.genre_ids) CAUSES DEADLOCK/ ASK ABOUT THIS ?
          }
        })
        pageNumber++
      } catch (err) {
        console.log(err)
      }
    }
  }
  public async getMovies({ request, response }: HttpContextContract) {
    await this.FetchIfNotEnough()
    let totalMovieNumber = (await Movie.all()).length
    console.log(totalMovieNumber)
    let allMovies
    try {
      const queryString = request.param('search')
      const searchString: string = queryString ? queryString.split('+').join(' ') : ''
      //Check if there is the movie with the exact search string in our database. If not, go to TMDB and try to fetch. If does not exist there either, Do nothing
      let isMatching = await this.exactMatchINDB(searchString)
      if (!isMatching) {
        console.log(`Searching for ${queryString} in TMDB API`)
        await this.addSingleMovieFromTMDB(queryString)
      }
      allMovies = await Movie.query()
        .where('title', 'REGEXP', `[a-zA-Z]*${searchString}[a-zA-Z]*`)
        .preload('genres')
        .preload('artists')
        .limit(72)
        .orderBy('id', 'desc')

      response.json(allMovies)
    } catch (err) {
      response.json(err)
    }
  }

  public async getSingleMovie({ request, response }: HttpContextContract) {
    try {
      const movie = await Movie.query()
        .where('id', request.param('movieId'))
        .preload('genres')
        .preload('artists')
      response.json(movie[0])
    } catch (err) {
      response.json(err)
    }
  }

  public async createMovie({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: movieValidator.movieSchema,
        messages: {
          required: 'The {{field}} is required',
          minLength: 'The {{field}} must have {{options.minLength}} or more characters',
          url: 'The poster must be a valid url',
        },
      })
      const movie = new Movie()
      movie.merge({
        title: payload.title,
        posterPath: payload.posterPath,
        description: payload.description,
      })
      await movie.save()
      await movie.related('artists').sync(request.body().artistsIds)
      await movie.related('genres').sync(request.body().genresIds)
      response.status(200)
    } catch (err) {
      console.log(err.messages)
      response.status(400).json(err)
      return err
    }
  }

  public async deleteMovie({ request }: HttpContextContract) {
    try {
      const currentMovieId = request.param('movieId')
      const movieToBeDeleted = await Movie.find(currentMovieId)
      await movieToBeDeleted!.delete()

      if (movieToBeDeleted!.tmdbId) {
        const deletedMovie = new DeletedMovie()
        deletedMovie.tmdbId = movieToBeDeleted!.tmdbId
        deletedMovie.save()
      }
    } catch (err) {
      return err
    }
  }

  public async updateMovie({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: movieValidator.movieSchema,
        messages: {
          minLength: 'The {{field}} must have {{options.minLength}} or more characters',
          required: 'The {{field}} is required',
        },
      })
      const movieToBeUpdated = await Movie.find(request.param('movieId'))
      movieToBeUpdated!.merge({
        title: payload.title,
        posterPath: payload.posterPath,
        description: payload.description,
      })
      await movieToBeUpdated?.related('artists').sync(request.body().relatedArtistsIds)
      await movieToBeUpdated?.related('genres').sync(request.body().relatedGenresIds)
      movieToBeUpdated!.save()
    } catch (err) {
      response.status(400).json(err)
    }
  }
}
