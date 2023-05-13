import { Env } from './../config/env'
import { type IContext } from '@hellocacbantre/context'
import { createConnect, newConnection, type IStoreDB } from '@hellocacbantre/db-schemas'

const { URI, OPTIONS } = Env.MONGO_CONNECTION

export const platformDb = newConnection(URI, {
  ...OPTIONS,
  dbName: 'platform'
})

export const getStoreDb = (context: IContext): IStoreDB => {
  const { mongoDb } = context
  return createConnect(mongoDb.instance)
}
