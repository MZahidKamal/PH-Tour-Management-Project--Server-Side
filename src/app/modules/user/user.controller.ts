import {NextFunction, Request, Response} from "express";
import httpStatus from "http-status-codes";
import {UserServices} from "./user.service";
import catchAsyncFunction from "../../utils/catchAsyncFunction";
import sendResponseFunction from "../../utils/sendResponseFunction";



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
const createUserController = catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {

        const newUser = await UserServices.createUserService(req.body);

        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "New user created successfully!",
            data: newUser
        })
    }
)



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
const getAllUsersController = catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {

        const allUsers = await UserServices.getAllUsersService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All users fetched successfully!",
            data: allUsers,
            meta: {
                total: allUsers.length
            }
        })
    }
)



// Named exports
export const UserControllers = {
    createUserController,
    getAllUsersController
};










/*
1. ** Problem: **
   In the controllers we kept writing the same `try { … } catch (error) { next(error) }` over and over. This repeats
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
