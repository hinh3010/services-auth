import { createConnect } from '@hellocacbantre/redis'
import { Env } from '../config'

export const RedisIoClient = createConnect(Env.REDIS_CONNECTION.URI)
