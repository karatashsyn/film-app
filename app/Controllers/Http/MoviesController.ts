import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { movieValidator } from 'App/utils/movieValidator'
import Movie from 'App/Models/Movie'
import fetch from 'node-fetch'

export default class MoviesController {
  public async alreadyAdded(movie: Movie) {
    const targetMovie = await Movie.findBy('tmdb_id', movie.tmdbId)
    if (targetMovie) {
      return true
    }
    return false
  }

  //Works correctly
  public async exactMatchINDB(title) {
    if (!(await Movie.findBy('title', title))) {
      console.log('not exact match')

      return false
    }

    console.log('exact match')

    return true
  }

  public async addSingleMovieFromTMDB(queryString) {
    let TMDbMovie

    await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=d54de950ca880b236aa90854632983ca&query=prey`
    )
      .then((res) => res.json())
      .then((data) => {
        TMDbMovie = data.results[0]
      })
    const movieToBeAdded = new Movie()

    if (TMDbMovie) {
      movieToBeAdded.merge({
        title: TMDbMovie.title,
        tmdbId: TMDbMovie.id,
        posterPath: 'https://image.tmdb.org/t/p/w500' + TMDbMovie.poster_path,
      })
      if (!this.alreadyAdded(movieToBeAdded)) {
        await movieToBeAdded.save()
        return movieToBeAdded.$attributes
      } else {
        console.log('You already have that film')
        return { message: 'You already have that film' }
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

  public async getMovies({ auth, request, response }: HttpContextContract) {
    try {
      const searchString: string = request.param('search')
        ? request.param('search').replace('+', ' ')
        : ''
      console.log(searchString)

      //Check if there is the movie with the exact search string in our database. If not, go to TMDB and try to fetch. If does not exist there either, Do nothing

      let allMovies
      if (!this.exactMatchINDB(searchString)) {
        console.log('not exact match')
        this.addSingleMovieFromTMDB(searchString.replace(' ', '+'))
      }

      allMovies = await Movie.query().where('title', 'REGEXP', `[a-zA-Z]*${searchString}[a-zA-Z]*`)

      response.json(allMovies)
    } catch (err) {
      response.json(err)
    }
  }

  //I'll use this to show the details of the clicked movie
  public async getSingleMovie({ request, response }: HttpContextContract) {
    try {
      const movie = await Movie.find(request.param('movieId'))
      return movie!.toJSON()
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
      })

      movieToBeUpdated!.save()
    } catch (err) {
      return err
    }
  }
}
