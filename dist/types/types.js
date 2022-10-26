"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedError = void 0;
class ExtendedError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
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
