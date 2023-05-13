import { type IContext } from '@hellocacbantre/context'
import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'

import { type SimpleFalcon } from '@hellocacbantre/redis'
import { AuthAction } from '../actions/auth.action'
import { getGlobalSetting } from '../config'
import { getFalcol } from '../connections/redisio.db'
import catchAsync from '../middlewares/catchAsync'
import { convertToSeconds } from '../utils/convertToSeconds'
// import { databaseResponseTimeHistogram } from '../utils/metrics'

export class AuthController {
  private readonly authAction: AuthAction
  private readonly context: IContext
  private readonly falcol: SimpleFalcon

  constructor(context: IContext) {
    this.authAction = new AuthAction(context)
    this.context = context
    this.falcol = getFalcol(context)
  }

  signUp = catchAsync(async (req: Request, res: Response) => {
    // const timer = databaseResponseTimeHistogram.startTimer()
    // timer({ operation: 'auth_sign_up', success: 'true' })

    const { newUser, refreshToken, token } = await this.authAction.signUp(this.context)(req.body)

    const refreshTokenExpiresString = await getGlobalSetting(this.context)('jwt_refresh_token_expires')
    const refreshTokenExpiresSeconds = convertToSeconds(refreshTokenExpiresString)

    // add redis
    void this.falcol.set(`auth:refreshToken:${newUser._id}`, refreshToken as string)
    void this.falcol.expire(`auth:refreshToken:${newUser._id}`, refreshTokenExpiresSeconds)

    res.set('Authorization', `Bearer ${token}`)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresSeconds * 1000
    })

    return res.json({
      status: 200,
      data: {
        newUser,
        token
      }
    })
  })

  signIn = catchAsync(async (req: Request, res: Response) => {
    // const timer = databaseResponseTimeHistogram.startTimer()
    // timer({ operation: 'auth_sign_in', success: 'true' })

    const { user, refreshToken, token } = await this.authAction.signIn(this.context)(req.body)

    const refreshTokenExpiresString = await getGlobalSetting(this.context)('jwt_refresh_token_expires')
    const refreshTokenExpiresSeconds = convertToSeconds(refreshTokenExpiresString)

    // add redis
    void this.falcol.set(`auth:refreshToken:${user._id}`, refreshToken as string)
    void this.falcol.expire(`auth:refreshToken:${user._id}`, refreshTokenExpiresSeconds)

    res.set('Authorization', `Bearer ${token}`)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresSeconds * 1000
    })

    return res.json({
      status: 200,
      data: {
        user,
        token
      }
    })
  })

  userinfo = catchAsync(async (req: Request, res: Response) => {
    // const timer = databaseResponseTimeHistogram.startTimer()
    // timer({ operation: 'auth_userinfo_by_token', success: 'true' })

    const userInfo: any = req.user as IUser

    delete userInfo.password

    return res.json({
      status: 200,
      data: userInfo
    })
  })
}
