import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MovieArtists extends BaseSchema {
  protected tableName = 'movie_artists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('movie_id').unsigned().references('movies.id')
      table.integer('artist_id').unsigned().references('artists.id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
