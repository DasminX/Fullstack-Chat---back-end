"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateErrors = void 0;
const types_1 = require("../types/types");
const validateErrors = (validationErrorArr, errorMsg, next) => {
    if (!validationErrorArr.isEmpty()) {
        next(new types_1.ExtendedError(errorMsg, 400));
    }
};
exports.validateErrors = validateErrors;
