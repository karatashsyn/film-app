import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Movie from './Movie'

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @manyToMany(() => Movie, {
    localKey: 'id',
    pivotForeignKey: 'genre_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'movie_id',
  })
  public movies: ManyToMany<typeof Movie>
}
