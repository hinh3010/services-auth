import { type Connection } from 'mongoose';
import { type Redis } from 'ioredis';
export interface IError {
    status: number;
    message: string;
}
export interface IContext {
    mongodb: Connection;
    redisDb: Redis;
}
