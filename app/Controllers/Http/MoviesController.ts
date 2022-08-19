// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { movieValidator } from 'App/utils/movieValidator'
import Movie from 'App/Models/Movie'

export default class MoviesController {
  public async getMovies({ auth, request }: HttpContextContract) {
    try {
      const allMovies = await Movie.query().where('user_id', auth.user!.id)
      return allMovies
    } catch (err) {
      return err
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
