// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Genre from 'App/Models/Genre'
import fetch from 'node-fetch'
const GENRES_URL =
  'https://api.themoviedb.org/3/genre/movie/list?api_key=d54de950ca880b236aa90854632983ca&language=en-US'
export default class GenresController {
  public async addTMDBGenresToMySqlDB() {
    let genreList
    await fetch(`${GENRES_URL}`)
      .then((res) => res.json())
      .then((jsonData) => (genreList = jsonData.genres))
    genreList.forEach(async (element) => {
      const newGenre = new Genre()
      newGenre.merge({
        id: element.id,
        name: element.name,
      })
      await newGenre.save()
    })
  }

  public async getGenres() {
    try {
      const genres = await Genre.all()
      return genres
    } catch (err) {
      return err
    }
  }
}
