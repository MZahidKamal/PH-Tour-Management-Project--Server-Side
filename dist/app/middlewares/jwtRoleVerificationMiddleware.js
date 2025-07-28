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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = __importDefault(require("../config/envConfig"));
const jwtRoleVerificationMiddleware = (...allowedRoles) => (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First, check if the request is coming with a token or not
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Token not found!");
        }
        // If the request is coming with a token, then verify it and check if it is valid or not
        const isBearerTokenVarified = jsonwebtoken_1.default.verify(bearerToken, envConfig_1.default.jwt_secret);
        if (!isBearerTokenVarified) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid token!");
        }
        // If the token is valid, then check if the user is authorized to perform this action or not
        const decodedToken = isBearerTokenVarified;
        if (!allowedRoles.includes(decodedToken.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to perform this action!");
        }
        // If the user is authorized, then pass the request to the next middleware
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = jwtRoleVerificationMiddleware;
