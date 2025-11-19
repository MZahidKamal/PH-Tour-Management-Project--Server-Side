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
const createUserController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // To create a new user in the database now send the request body to the service layer
    const newUser = yield user_service_1.UserServices.createUserService(req.body);
    // And then send the response with the new user data
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "New user created successfully!",
        data: newUser
    });
}));
const getAllUsersController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // To get all the users from the database now go to the service layer and get all the users
    const allUsers = yield user_service_1.UserServices.getAllUsersService();
    // And then send the response with all the users data
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
const getThisSingleUserController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // TO get this single user from the database now go to the service layer and get a single user
    const thisSingleUserResult = yield user_service_1.UserServices.getThisSingleUserService(req);
    // And then send the response with the user's data
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "This single user data fetched successfully!",
        data: thisSingleUserResult,
    });
}));
const getASingleUserController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // TO get a single user from the database now go to the service layer and get a single user
    const aSingleUserResult = yield user_service_1.UserServices.getASingleUserService(req);
    // And then send the response with the user's data
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "A single user data fetched successfully!",
        data: aSingleUserResult,
    });
}));
const updateUserController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the userId from the params, the updated data from the request body, and the bearer token from the headers
    const userId = req.params.userId;
    const updatedData = req.body;
    // Usually the bearer token can be found in the req.headers.authorization, but it's not yet verified.
    // But we don't want to verify the token once again here, because it has already been verified in the previous jwtRoleVerificationMiddleware.
    // So we simply saved the verified token in the modified request object req.userToken in the previous middleware.
    // So now we can get the verified token from the modified request object
    const verifiedToken = req.userToken;
    // If the user is authorized, then send the necessary parameters to the service layer
    const updatedUser = yield user_service_1.UserServices.updateUserService(userId, updatedData, verifiedToken);
    // Finally, send the response with the updated user data
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User updated successfully!",
        data: updatedUser
    });
}));
// Named exports
exports.UserControllers = {
    createUserController,
    getAllUsersController,
    getThisSingleUserController,
    getASingleUserController,
    updateUserController
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
