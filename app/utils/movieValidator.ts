/* eslint-disable */
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export namespace movieValidator {
  export const movieSchema = schema.create({
    title: schema.string({ trim: true }, [rules.minLength(1)]),
    posterPath: schema.string({ trim: true }, [rules.url()]),
    description: schema.string({ trim: true }, [rules.minLength(12)]),
  })
}
