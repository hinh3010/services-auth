"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreDb = exports.platformDb = void 0;
const env_1 = require("./../config/env");
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const { URI, OPTIONS } = env_1.Env.MONGO_CONNECTION;
exports.platformDb = (0, db_schemas_1.newConnection)(URI, Object.assign(Object.assign({}, OPTIONS), { dbName: 'platform' }));
const getStoreDb = (context) => {
    const { mongoDb } = context;
    return (0, db_schemas_1.createConnect)(mongoDb.instance);
};
exports.getStoreDb = getStoreDb;
