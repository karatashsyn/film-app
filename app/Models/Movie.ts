import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Genre from './Genre'

import Artist from './Artist'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public tmdbId: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public posterPath: string

  @column()
  public genreIds: Array<number>

  @manyToMany(() => Genre, {
    localKey: 'id',
    pivotForeignKey: 'movie_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'genre_id',
  })
  public genres: ManyToMany<typeof Genre>

  @manyToMany(() => Artist, {
    localKey: 'id',
    pivotForeignKey: 'movie_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'artist_id',
  })
  public artists: ManyToMany<typeof Artist>
}
