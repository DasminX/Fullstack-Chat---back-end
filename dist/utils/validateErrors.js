"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateErrors = void 0;
const validateErrors = (validationErrorArr, errorMsg, statusCode) => {
    if (!validationErrorArr.isEmpty()) {
        const error = new Error(errorMsg);
        error.statusCode = statusCode;
        throw error;
    }
};
exports.validateErrors = validateErrors;
