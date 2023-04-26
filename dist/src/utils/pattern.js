"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordPattern = exports.phonePattern = exports.emailPattern = void 0;
exports.emailPattern = /gmail.com/;
exports.phonePattern = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;
exports.passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})$/;
