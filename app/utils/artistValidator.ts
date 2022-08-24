/* eslint-disable */
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export namespace artistValidator {
  export const artistSchema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(3)]),
    biography: schema.string(),
    profilePath: schema.string(),
    placeOfBirth: schema.string(),
  })
}
