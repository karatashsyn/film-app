import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Artists extends BaseSchema {
  protected tableName = 'artists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unique()
      table.string('name')
      table.string('biography')
      table.string('profile_path')
      table.string('place_of_birth')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
