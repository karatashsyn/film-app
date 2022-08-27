import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Artist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public tmdbId: number

  @column()
  public name: string

  @column()
  public biography: string

  @column()
  public profilePath: string

  @column()
  public placeOfBirth: string
}
