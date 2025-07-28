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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = __importDefault(require("../../config/envConfig"));
const loginWithCredentialsService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring the payload
    const { email, password } = payload;
    // Checking the user with the provided email exists in the database
    const userFromDatabase = yield user_model_1.default.findOne({ email });
    if (!userFromDatabase) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // If the user is found, then check if the password provided is correct
    const isPasswordValid = yield bcryptjs_1.default.compare(password, userFromDatabase.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid password!");
    }
    // If the password is correct, then create a JWT token using some information about the user, ***not all of them***
    const jwtPayload = {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        role: userFromDatabase.role,
    };
    const jwtSecret = envConfig_1.default.jwt_secret;
    const jwtExpiration = "1d";
    // const jwtExpiration: string | number = envConfig.jwt_expires_in;     // TODO: Find out why this is not working
    const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn: jwtExpiration });
    // after creating the JWT token, return some information about the user along with the JWT token
    const { email: userEmail, role } = userFromDatabase, rest = __rest(userFromDatabase, ["email", "role"]);
    return {
        email: userEmail,
        role,
        accessToken: jwtToken
    };
});
// Named exports
exports.AuthServices = {
    loginWithCredentialsService
};
