import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { movieValidator } from 'App/utils/movieValidator'
import Movie from 'App/Models/Movie'
import fetch from 'node-fetch'
import Genre from 'App/Models/Genre'
import GenreMovie from 'App/Models/GenreMovie'

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
        // console.log('GenreIds Below')
        // console.log(TMDBMovieGenreIds)

        await movieToBeAdded.save()
        // Setting bond between each genre we added and the added movie
        TMDBMovieGenreIds.forEach(async (id) => {
          Movie.$getRelation('genres')?.boot()
          await movieToBeAdded.related('genres').attach([id])
        })
        return movieToBeAdded.$attributes
      }
    } else {
      console.log('There is no such movie')
      return { message: 'There is no such movie' }
    }
  }

  // public async getMoviesFromTMDBAPI() {
  //   //Most 20 popular movie
  //   let movies
  //   await fetch(
  //     'https://api.themoviedb.org/3/discover/movie?api_key=d54de950ca880b236aa90854632983ca&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate'
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data)
  //       movies = data.results
  //     })
  //   return movies
  // }
  public async addRelation({ request }: HttpContextContract) {
    const infoObject = this.pairInfoEncoder(request.param('pairInfo'))
    const relatedMovie = await Movie.find(infoObject.movieId)
    Movie.$getRelation('genres')?.boot()
    await relatedMovie!.related('artists').attach([infoObject.artistId])
  }

  //CRUD OPERATIONS for Movies\
  public async getMovies({ request, response }: HttpContextContract) {
    // function queryEncoder(queryString) {
    //   const allKeyValues = queryString.split('&')
    //   console.log(allKeyValues)
    //   const queryObject = {
    //     title: allKeyValues[0].split('=')[1],
    //     categoryId: allKeyValues[1].split('=')[1],
    //   }
    //   return queryObject
    // }
    // console.log(queryEncoder('searchkey=naber&categoryId=5'))

    let allMovies
    //if url.has(categoryId),
    //allmovies = Movie.query().filter(e=>e.genres.includes(categoryIdComingFromUrl))
    const someGenre = await Genre.find(27)
    console.log(someGenre)

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
        console.log(`Searching for ${queryString} in TMDB API`)
        await this.addSingleMovieFromTMDB(queryString)
      }
      allMovies = await Movie.query()
        .where('title', 'REGEXP', `[a-zA-Z]*${searchString}[a-zA-Z]*`)
        .preload('genres')
        .preload('artists')

      ////////////////////////////////////////////////////////////////////////////////

      // allMovies.forEach((e) => {
      //Filter by category id
      // })

      ////////////////////////////////////////////////////////////////////////////////
      response.json(allMovies)
    } catch (err) {
      response.json(err)
    }
  }

  //I'll use this to show the details of the clicked movie (NOT A GOOD PRACTISE)
  public async getSingleMovie({ request, response }: HttpContextContract) {
    try {
      // const movie = await Movie.find(request.param('movieId'))
      const movie = await Movie.query()
        .where('id', request.param('movieId'))
        .preload('genres')
        .preload('artists')
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
