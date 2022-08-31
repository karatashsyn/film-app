// import BaseSchema from '@ioc:Adonis/Lucid/Schema'

// export default class GenreMovies extends BaseSchema {
//   protected tableName = 'movie_genre'

//   public async up() {
//     this.schema.createTable(this.tableName, (table) => {
//       table.increments('id')
//       table.integer('movie_id')
//       table.integer('genre_id')
//     })
//   }
//   public async down() {
//     this.schema.dropTable(this.tableName)
//   }
// }
//MANY TO MANY, PARENT IS GENRE
