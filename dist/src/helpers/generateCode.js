"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
function generateCode(length = 8) {
    const wordArray = crypto_js_1.default.lib.WordArray.random(length);
    return wordArray.toString(crypto_js_1.default.enc.Hex).toUpperCase().substring(0, length);
}
exports.generateCode = generateCode;
