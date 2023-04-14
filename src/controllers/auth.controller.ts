import { type Request, type Response } from 'express'
import { AuthAction } from '../actions/auth.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'
import { falcol } from '../connections/redisio.db'

export class AuthController {
  constructor(private readonly authAction: AuthAction = new AuthAction()) {}

  signUp = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_up', success: 'true' })

    const { newUser, refreshToken, token } = await this.authAction.signUp()(req.body)

    // add redis
    void falcol.set(`refreshToken:${newUser._id}`, refreshToken as string)
    void falcol.expire(`refreshToken:${newUser._id}`, 2592000)

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

    const { user, refreshToken, token } = await this.authAction.signIn()(req.body)

    // add redis
    void falcol.set(`refreshToken:${user._id}`, refreshToken as string)
    void falcol.expire(`refreshToken:${user._id}`, 2592000)

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
