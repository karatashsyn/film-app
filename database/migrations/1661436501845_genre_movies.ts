import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GenreMovies extends BaseSchema {
  protected tableName = 'genre_movie'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('genre_id')
      table.integer('movie_id')
    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
// MANY TO MANY, PARENT IS MOVIE
