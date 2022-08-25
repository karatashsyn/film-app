import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { movieValidator } from 'App/utils/movieValidator'
import Movie from 'App/Models/Movie'
import fetch from 'node-fetch'
import Genre from 'App/Models/Genre'

export default class MoviesController {
  public async alreadyAdded(movie): Promise<boolean> {
    const targetMovie = await Movie.findBy('tmdb_id', movie.tmdbId)
    if (targetMovie) {
      console.log('You already have a movie with the same TMDB id ')

      return true
    } else {
      console.log('This is not added')

      return false
    }
  }

  //Works correctly
  public exactMatchINDB = async (title) => {
    const targetMovie = await Movie.findBy('title', title)
    if (!targetMovie) {
      console.log('No Match')

      return false
    }
    console.log('exact match')
    return true
  }

  public async addSingleMovieFromTMDB(queryString) {
    let TMDbMovie
    let TMDBMovieGenreIds
    if (queryString) {
      await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=d54de950ca880b236aa90854632983ca&query=${queryString}`
      )
        .then((res) => res.json())
        .then((data) => {
          TMDbMovie = data.results[0]
          TMDBMovieGenreIds = TMDbMovie.genre_ids
        })
    }

    const movieToBeAdded = new Movie()
    if (TMDbMovie) {
      movieToBeAdded.merge({
        title: TMDbMovie.title,
        tmdbId: TMDbMovie.id,
        description: TMDbMovie.overview,
        posterPath: 'https://image.tmdb.org/t/p/w500' + TMDbMovie.poster_path,
      })
      //We said that as a result of not finding exact match, we should go to the TMDB and discover the closest match by the search string
      //But it is possible to add same film. For instance, Let us assume that we have 'dark blood' in our DB. And we typed 'dark blo'.
      //Since there is not exact matc, backend will try to find a movie on tmdb (Which will be dark blood in this case) and try to push it into our DB.
      // In order to prevent duplicate films, we check the tmdb_id of the film we are trying to add
      if (await this.alreadyAdded(movieToBeAdded)) {
        return { message: 'You already have that film' }
      } else {
        console.log(movieToBeAdded.$attributes)
        console.log('GenreIds Below')
        console.log(TMDBMovieGenreIds)

        await movieToBeAdded.save()
        TMDBMovieGenreIds.forEach(async (id) => {
          const genre = await Genre.find(id)
          console.log(genre?.$attributes)

          console.log('pivottttttt')
          Movie.$getRelation('genres')?.boot()
          await movieToBeAdded.related('genres').attach([id])
          console.log(Movie.$getRelation('genres')!.getPivotRelatedPair(movieToBeAdded))
        })
        return movieToBeAdded.$attributes
      }
    } else {
      console.log('There is no such movie')
      return { message: 'There is no such movie' }
    }
  }

  public async getMoviesFromTMDBAPI() {
    //Most 20 popular movie
    let movies
    await fetch(
      'https://api.themoviedb.org/3/discover/movie?api_key=d54de950ca880b236aa90854632983ca&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate'
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        movies = data.results
      })
    return movies
  }

  //CRUD OPERATIONS for Movies

  public async getMovies({ request, response }: HttpContextContract) {
    let allMovies
    try {
      if (request.param('categoryId')) {
        // MovieCategory tablosundan category id si 'categoryId' ile es olanlari alip movieleri preloadla.
      }
      const queryString = request.param('search')
      const searchString: string = queryString ? queryString.split('+').join(' ') : ''
      //Check if there is the movie with the exact search string in our database. If not, go to TMDB and try to fetch. If does not exist there either, Do nothing

      let isMatching = await this.exactMatchINDB(searchString)
      console.log(isMatching)
      if (!isMatching) {
        await this.addSingleMovieFromTMDB(queryString)
      }

      allMovies = await Movie.query()
        .where('title', 'REGEXP', `[a-zA-Z]*${searchString}[a-zA-Z]*`)
        .preload('genres')

      response.json(allMovies)
    } catch (err) {
      response.json(err)
    }
  }

  //I'll use this to show the details of the clicked movie (NOT A GOOD PRACTISE)
  public async getSingleMovie({ request, response }: HttpContextContract) {
    try {
      // const movie = await Movie.find(request.param('movieId'))
      const movie = await Movie.query().where('id', request.param('movieId')).preload('genres')
      response.json(movie[0])
    } catch (err) {
      response.json(err)
    }
  }

  public async createMovie({ auth, request }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: movieValidator.movieSchema })
      const movie = new Movie()
      movie.merge({
        title: payload.title,
        posterPath: payload.posterPath,
        description: payload.description,
      })
      await movie.save()
    } catch (err) {
      return err
    }
  }

  public async deleteMovie({ request }: HttpContextContract) {
    try {
      const currentMovieId = request.param('movieId')
      await Movie.query().where('id', currentMovieId).delete()
    } catch (err) {
      return err
    }
  }

  public async updateMovie({ request }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: movieValidator.movieSchema })
      const currentMovieId = request.param('movieId')
      const movieToBeUpdated = await Movie.find(currentMovieId)
      movieToBeUpdated!.merge({
        title: payload.title,
        posterPath: payload.posterPath,
        description: payload.description,
      })

      movieToBeUpdated!.save()
    } catch (err) {
      return err
    }
  }
}
