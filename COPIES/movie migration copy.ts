import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Movies extends BaseSchema {
  protected tableName = 'movies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tmdb_id')
      table.string('title')
      table.string('description')
      table.string('poster_path')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
