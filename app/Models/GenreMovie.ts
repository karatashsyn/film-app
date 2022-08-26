import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Movie from './Movie'

export default class GenreMovie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public genre_id: number

  @column()
  public movie_id: number

  @belongsTo(() => Movie)
  public movie: BelongsTo<typeof Movie>
}
