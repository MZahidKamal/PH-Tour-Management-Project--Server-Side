"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const consolePrintFunction_1 = require("../utils/consolePrintFunction");
const zodValidationMiddleware = (zodSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('Pre Validated Request: ', req.body);
        // First, check if user-creating inputs are valid, according to the Zod schema, or not
        req.body = yield zodSchema.parseAsync(req.body);
        // console.log('Post Validated Request: ', req.body);
        // If the inputs are valid, then pass the request to the next middleware
        next();
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)('Zod Validation Error: ', error);
        next(error);
    }
});
exports.default = zodValidationMiddleware;
