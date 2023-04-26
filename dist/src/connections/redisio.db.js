"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoClient = void 0;
const redis_1 = require("@hellocacbantre/redis");
const config_1 = require("../config");
exports.RedisIoClient = (0, redis_1.createConnect)(config_1.Env.REDIS_CONNECTION.URI);
