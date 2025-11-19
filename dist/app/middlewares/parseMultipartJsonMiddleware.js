"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consolePrintFunction_1 = require("../utils/consolePrintFunction");
const parseMultipartJsonMiddleware = (req, _res, next) => {
    // If there's a 'data' field in body (from multipart/form-data), parse it
    if (req.body.data && typeof req.body.data === 'string') {
        try {
            req.body = JSON.parse(req.body.data);
        }
        catch (error) {
            // If parsing fails, leave it as is
            // console.error('Failed to parse multipart JSON data:', error);
            (0, consolePrintFunction_1.consolePrint)('Failed to parse multipart JSON data:', error);
        }
    }
    next();
};
exports.default = parseMultipartJsonMiddleware;
