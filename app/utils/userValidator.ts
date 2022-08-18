/* eslint-disable */
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export namespace userValidator {
  export const registerSchema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string({}, [rules.minLength(4)]),
  })

  export const loginSchema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string({}, [rules.required()]),
  })
}
