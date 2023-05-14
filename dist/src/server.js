"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routers_1 = require("./routers");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const _loggers_1 = __importDefault(require("./@loggers"));
const config_1 = require("./config");
const server_loader_1 = require("./server.loader");
const redisio_db_1 = require("./connections/redisio.db");
const mongo_db_1 = require("./connections/mongo.db");
// import { startMetricsServer } from './utils/metrics'
// import swaggerDocs from './utils/swagger'
const handlerError = (err, _, res, __) => {
    var _a;
    return res.json({
        status: (_a = err.status) !== null && _a !== void 0 ? _a : 500,
        message: err.message
    });
};
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.context = {
            mongoDb: {
                instance: mongo_db_1.platformDb
            },
            redisDb: {
                instance: redisio_db_1.redisClient
            }
        };
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, server_loader_1.serverLoader)(this.app);
            this.app.use(`/${config_1.Env.SERVICE_NAME}`, this.routes());
            this.app.get('/*', (_, res) => {
                res.json({
                    message: `welcome service ${config_1.Env.SERVICE_NAME}`
                });
            });
            this.app.use(handlerError);
            this.listen(Number(config_1.Env.PORT));
        });
    }
    routes() {
        return new routers_1.AuthRouter(this.context).getRouter();
    }
    listen(port) {
        this.app.listen(port, () => {
            _loggers_1.default.info(`[Server_Start:::] http://localhost:${port}/`);
            // swaggerDocs(this.app, port)
            // startMetricsServer(this.app, port)
        });
    }
}
void (() => __awaiter(void 0, void 0, void 0, function* () {
    // const server = new Server()
    // await server.start()
}))();
