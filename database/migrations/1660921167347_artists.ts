import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Artists extends BaseSchema {
  protected tableName = 'artists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('full_name')
      table.string('description')
      table.string('poster_path')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
