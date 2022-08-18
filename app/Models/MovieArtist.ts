import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Artist from './Artist'

export default class MovieArtist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public movieId: number

  @column()
  public artistId: number

  @belongsTo(() => Artist)
  public artist: BelongsTo<typeof Artist>
}
