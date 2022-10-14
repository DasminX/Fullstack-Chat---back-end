"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedError = void 0;
class ExtendedError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
    }
}
exports.ExtendedError = ExtendedError;
/*
export class ExtendedError extends Error {
  constructor(message,statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}
 */
