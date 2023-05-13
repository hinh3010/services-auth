"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
class BaseRouter {
    constructor(context) {
        this.router = (0, express_1.Router)();
        this.context = context;
        // this.configureRoutes()
    }
    getRouter() {
        this.configureRoutes();
        return this.router;
    }
}
exports.BaseRouter = BaseRouter;
