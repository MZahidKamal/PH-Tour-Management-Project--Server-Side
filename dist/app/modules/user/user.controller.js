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
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
/*const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await UserServices.createUserService(req.body);

        res.status(httpStatus.CREATED).json({
            success: true,
            message: "New user created successfully!",
            data: newUser,
        });
    }
    catch (error: unknown) {
        next(error);
    }
}*/
const createUserController = (0, catchAsyncFunction_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_service_1.UserServices.createUserService(req.body);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "New user created successfully!",
        data: newUser
    });
}));
/*const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await UserServices.getAllUsersService();

        res.status(httpStatus.OK).json({
            success: true,
            message: "All users fetched successfully!",
            data: allUsers,
        });
    }
    catch (error: unknown) {
        next(error);
    }
}*/
const getAllUsersController = (0, catchAsyncFunction_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield user_service_1.UserServices.getAllUsersService();
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All users fetched successfully!",
        data: allUsers,
        meta: {
            total: allUsers.length
        }
    });
}));
// Named exports
exports.UserControllers = {
    createUserController,
    getAllUsersController
};
/*
1. ** Problem: **
   In the controllers we kept writing the same try-catch block over and over. This repeats
   the same code and makes the files longer.

2. ** DRY Principle: **
   “Don’t Repeat Yourself” means we should extract shared logic into one place instead of copying it everywhere.

3. ** Solution: **
   - Create a helper in `utils/catchAsyncFunction.ts`.
   - This file exports a higher-order function called `catchAsyncFunction`.
   - It takes any async controller function, runs it, and automatically catches errors.

4. ** How It Works: **
   - You wrap each async controller with `catchAsyncFunction(...)`.
   - If the inner function throws, `.catch(next)` sends the error to your global error handler.

5. ** Benefit: **
   - Controller code stays focused on business logic, without repeated `try-catch`.
   - Error catching is centralized and consistent.
   - Files become shorter and easier to read.
*/
