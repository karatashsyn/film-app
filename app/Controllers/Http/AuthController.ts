import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

import { userValidator } from 'App/utils/userValidator'

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: userValidator.registerSchema })
      const user = new User()
      user.merge({
        email: payload.email,
        password: payload.password,
      })
      await user.save()
    } catch (error) {
      console.log(error)
      return error
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: userValidator.loginSchema })
      const userInDB = await User.findByOrFail('email', payload.email)
      if (!(await Hash.verify(userInDB.password, payload.password))) {
        console.log('Invalid credentials')
        return response.unauthorized('Invalid credentials')
      }
      const token = await auth.use('api').generate(userInDB, { expiresIn: '4days' })
      console.log(token)
      return token.toJSON()
    } catch (err) {
      return err
    }
  }

  public async logout({ auth }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return {
        message: 'Logged out',
        revoked: true,
      }
    } catch (err) {
      return err
    }
  }
}
