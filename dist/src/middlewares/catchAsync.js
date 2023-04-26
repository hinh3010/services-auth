"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _loggers_1 = __importDefault(require("../@loggers"));
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        const { message, status } = err;
        // Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}
        _loggers_1.default.error(`
        [${new Date().toLocaleString()}]
        Message "${message}"
        Status "${status || 500}"
      `);
        next(err);
    });
    // fn(req, res, next).catch(next)
};
exports.default = catchAsync;
