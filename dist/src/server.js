"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const _loggers_1 = __importDefault(require("./@loggers"));
const config_1 = require("./config");
const server_loader_1 = require("./server.loader");
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
                uri: config_1.Env.MONGO_CONNECTION.URI,
                options: config_1.Env.MONGO_CONNECTION.OPTIONS
            },
            redisDb: {
                uri: config_1.Env.REDIS_CONNECTION.URI
            }
        };
        void (0, server_loader_1.serverLoader)(this.app);
        this.app.use(`/${config_1.Env.SERVICE_NAME}`, this.routes());
        this.app.get('/*', (_, res) => {
            res.json({
                message: `welcome ${config_1.Env.SERVICE_NAME} service`
            });
        });
        this.app.use(handlerError);
        this.listen(Number(config_1.Env.PORT));
    }
    routes() {
        return new routes_1.AuthRouter(this.context).router;
    }
    listen(port) {
        this.app.listen(port, () => {
            _loggers_1.default.info(`[Server_Start:::] http://localhost:${port}/`);
            // swaggerDocs(this.app, port)
            // startMetricsServer(this.app, port)
        });
    }
}
// eslint-disable-next-line no-new
new Server();
