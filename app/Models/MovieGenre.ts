import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Genre from './Genre'

export default class MovieGenre extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public movieId: number

  @column()
  public genreId: number

  @belongsTo(() => Genre)
  public genre: BelongsTo<typeof Genre>
}
