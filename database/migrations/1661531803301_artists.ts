import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Artists extends BaseSchema {
  protected tableName = 'artists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('tmdb_id')
      table.string('name')
      table.text('biography')
      table.string('profile_path')
      table.string('place_of_birth')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
