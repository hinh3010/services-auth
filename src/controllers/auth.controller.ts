import { type Request, type Response } from 'express'
import { AuthAction } from '../actions/auth.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'
import { type IContext } from '../@types'
import { SimpleFalcon } from '@hellocacbantre/redis'

export class AuthController {
  private readonly authAction: AuthAction
  private readonly context: IContext
  private readonly falcol: SimpleFalcon

  constructor(context: IContext) {
    this.authAction = new AuthAction(context)
    this.context = context
    const { redisDb } = this.context
    this.falcol = new SimpleFalcon(redisDb, 'auth')
  }

  signUp = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_up', success: 'true' })

    const { newUser, refreshToken, token } = await this.authAction.signUp(this.context)(req.body)

    // add redis
    void this.falcol.set(`auth:refreshToken:${newUser._id}`, refreshToken as string)
    void this.falcol.expire(`auth:refreshToken:${newUser._id}`, 2592000)

    res.set('Authorization', `Bearer ${token}`)

    res.cookie('token', token, { httpOnly: true, maxAge: 604800 * 1000 })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 2592000 * 1000
    })

    return res.json({
      status: 200,
      data: newUser
    })
  })

  signIn = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_in', success: 'true' })

    const { user, refreshToken, token } = await this.authAction.signIn(this.context)(req.body)

    // add redis
    void this.falcol.set(`auth:refreshToken:${user._id}`, refreshToken as string)
    void this.falcol.expire(`auth:refreshToken:${user._id}`, 2592000)

    res.set('Authorization', `Bearer ${token}`)

    res.cookie('token', token, { httpOnly: true, maxAge: 604800 * 1000 })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 2592000 * 1000
    })

    return res.json({
      status: 200,
      data: user
    })
  })
}
