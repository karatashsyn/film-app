import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import MovieArtist from './MovieArtist'
import MovieGenre from './MovieGenre'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public tmdbId: number

  @column()
  public title: string

  @column()
  public posterPath: string

  @hasMany(() => MovieArtist)
  public movieArtists: HasMany<typeof MovieArtist>

  @hasMany(() => MovieGenre)
  public movieGenres: HasMany<typeof MovieGenre>
}
