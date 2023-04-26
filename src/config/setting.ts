import { SimpleFalcon } from '@hellocacbantre/redis'
import { type IContext } from '../@types'

export const getGlobalSetting = (context: IContext) => {
  const falcol = new SimpleFalcon(context.redisDb)
  return async (key: string): Promise<string> => {
    return (await falcol.get(`global_setting:${key}`)) ?? ''
  }
}
