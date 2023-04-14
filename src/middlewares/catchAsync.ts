import { type NextFunction, type Request, type Response } from 'express'
import Logger from '../@loggers'
import { type IError } from '../@types'

const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err: IError) => {
    const { message, status } = err
    // Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}
    Logger.error(`
        [${new Date().toLocaleString()}]
        Message "${message}"
        Status "${status || 500}"
      `)
    next(err)
  })
  // fn(req, res, next).catch(next)
}

export default catchAsync
