import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { movieValidator } from 'App/utils/movieValidator'
import Movie from 'App/Models/Movie'
import fetch from 'node-fetch'

export default class MoviesController {
  public async addSingleMovieFromTMDBAPI({ auth }: HttpContextContract) {
    let movieObjectFromAPI
    await fetch('https://api.themoviedb.org/3/movie/600?api_key=d54de950ca880b236aa90854632983ca')
      .then((res) => res.json())
      .then((data) => {
        movieObjectFromAPI = data
      })
    const cropedMovieObject = new Movie()
    cropedMovieObject.merge({
      userId: auth.user!.id,
      title: movieObjectFromAPI.title,
      posterPath: 'https://image.tmdb.org/t/p/w500' + movieObjectFromAPI.poster_path,
    })
    await cropedMovieObject.save()
    return cropedMovieObject.$attributes
  }

  public async getMoviesFromTMDBAPI({ auth }: HttpContextContract) {
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
      const searchString = 'gvil'
      const allMovies = await Movie.query().where(
        'title',
        'REGEXP',
        `[a-zA-Z]*${searchString}[a-zA-Z]*`
      )
      if (allMovies.length < 20) {
      }
      response.json(allMovies)
    } catch (err) {
      response.json(err)
    }
  }

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
        userId: auth.user!.id,
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
