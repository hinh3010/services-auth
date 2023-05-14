"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedlock = exports.getFalcol = exports.getRedisClient = exports.redisClient = void 0;
const redis_1 = require("@hellocacbantre/redis");
const config_1 = require("../config");
exports.redisClient = (0, redis_1.createConnect)(config_1.Env.REDIS_CONNECTION.URI);
const getRedisClient = () => (0, redis_1.createConnect)(config_1.Env.REDIS_CONNECTION.URI);
exports.getRedisClient = getRedisClient;
const getFalcol = (context) => {
    const { redisDb } = context;
    const falcol = new redis_1.SimpleFalcon(redisDb.instance);
    return falcol;
};
exports.getFalcol = getFalcol;
const getRedlock = (context) => {
    const { redisDb } = context;
    const redlock = new redis_1.SimpleRedlock([redisDb.instance]);
    return redlock;
};
exports.getRedlock = getRedlock;
