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
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const createUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield user_service_1.UserServices.createUserService(req.body);
        res.status(http_status_codes_1.default.CREATED).json({
            success: true,
            message: "New user created successfully!",
            data: newUser,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user_service_1.UserServices.getAllUsersService();
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: "All users fetched successfully!",
            data: allUsers,
        });
    }
    catch (error) {
        next(error);
    }
});
// Named exports
exports.UserControllers = {
    createUserController,
    getAllUsersController
};
