import { SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis';
import { type IContext } from '@hellocacbantre/context';
export declare const getRedisClient: (uri: string) => import("ioredis/built/Redis").default;
export declare const getFalcol: (context: IContext) => SimpleFalcon;
export declare const getRedlock: (context: IContext) => SimpleRedlock;
