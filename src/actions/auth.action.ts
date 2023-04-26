import Bluebird from 'bluebird'
import createError from 'http-errors'
import { generateCode } from '../helpers'
import { createConnect, type IUser } from '@hellocacbantre/db-schemas'
import { type IContext } from '../@types'
import { JwtService } from '@hellocacbantre/auth-role'

const generateReferralCode = (context: IContext) => {
  const { getModel } = createConnect(context.mongodb)
  const User = getModel<IUser>('User')
  return async (): Promise<string> => {
    const referralCode = generateCode()
    const isReferralCode = await User.exists({ referralCode })
    if (isReferralCode) return generateReferralCode(context)()
    else return referralCode
  }
}

export class AuthAction {
  private readonly jwtService: JwtService
  constructor(context: IContext) {
    this.jwtService = new JwtService(context)
  }

  signUp(context: IContext) {
    const { getModel } = createConnect(context.mongodb)
    const User = getModel<IUser>('User')

    return async (payload: IUser) => {
      const { email, password, firstName, lastName, inviteCode }: IUser = payload

      const isConflict = await User.exists({ email })

      if (isConflict) throw createError.Conflict(`${email} is already`)

      // generate referral code
      const referralCode = await generateReferralCode(context)()

      const data = {
        firstName,
        lastName,
        email,
        password,
        referralCode,
        inviteCode: ''
      }

      const isInviteCode = await User.exists({ referralCode: inviteCode })
      if (isInviteCode) data.inviteCode = inviteCode

      // Create a new user
      const newUser = new User(data)
      await newUser.save()

      const { _id } = newUser

      // generate token
      const [token, refreshToken] = await Bluebird.all([
        this.jwtService.generateAccessToken({ _id }),
        this.jwtService.generateRefreshToken({ _id })
      ])

      return { token, refreshToken, newUser }
    }
  }

  signIn(context: IContext) {
    const { getModel } = createConnect(context.mongodb)
    const User = getModel<IUser>('User')

    return async (payload: IUser) => {
      const { email, password }: IUser = payload

      const user = await User.findOne({ email })

      if (!user) throw createError.UnprocessableEntity(`${email} invalid`)

      const { status, _id } = user

      if (status === 'banned') throw createError.Forbidden('Account banned')

      const isCorrectPassword = await user.isValidPassword(password)
      if (!isCorrectPassword) throw createError.Unauthorized('password invalid')

      // generate token
      const [token, refreshToken] = await Bluebird.all([
        this.jwtService.generateAccessToken({ _id }),
        this.jwtService.generateRefreshToken({ _id })
      ])

      return { token, refreshToken, user }
    }
  }
}
