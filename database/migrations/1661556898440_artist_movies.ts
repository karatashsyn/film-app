import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ArtistMovies extends BaseSchema {
  protected tableName = 'artist_movie'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('artist_id')
      table.integer('movie_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
