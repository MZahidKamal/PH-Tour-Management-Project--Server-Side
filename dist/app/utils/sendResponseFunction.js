"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponseFunction = (res, data) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        data: data.data,
        meta: data.meta
    });
};
exports.default = sendResponseFunction;
