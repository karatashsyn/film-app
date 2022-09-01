import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DeletedMovies extends BaseSchema {
  protected tableName = 'deleted_movies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.integer('tmdb_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
