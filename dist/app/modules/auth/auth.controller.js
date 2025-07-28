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
exports.AuthControllers = void 0;
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const auth_service_1 = require("./auth.service");
const loginWithCredentialsController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = yield auth_service_1.AuthServices.loginWithCredentialsService(req.body);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User logged in successfully!",
        data: loggedInUser
    });
}));
// Named exports
exports.AuthControllers = {
    loginWithCredentialsController
};
