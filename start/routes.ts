/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import AuthController from 'App/Controllers/Http/AuthController'
// import GenresController from 'App/Controllers/Http/GenresController'
import MoviesController from 'App/Controllers/Http/MoviesController'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/movies/:search?', 'MoviesController.getMovies')
Route.get('/movie/:movieId', 'MoviesController.getSingleMovie')
Route.post('/movies', 'MoviesController.createMovie')
Route.patch('movies/:movieId', 'MoviesController.updateMovie')
Route.delete('movies/:movieId', 'MoviesController.deleteMovie')

Route.post('/artists', 'ArtistsController.createArtist')
Route.get('/artists/:search?', 'ArtistsController.getArtists')
Route.get('/artist/:artistId', 'ArtistsController.getSingleArtist')

Route.get('/genres', 'GenresController.getGenres')
