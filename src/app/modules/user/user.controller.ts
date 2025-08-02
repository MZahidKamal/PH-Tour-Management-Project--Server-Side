import {NextFunction, Request, Response} from "express";
import httpStatus from "http-status-codes";
import {UserServices} from "./user.service";
import catchAsyncFunction from "../../utils/catchAsyncFunction";
import sendResponseFunction from "../../utils/sendResponseFunction";
import {JwtPayload} from "jsonwebtoken";
import {UserInterface} from "./user.interface";





const createUserController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        // To create a new user in the database now send the request body to the service layer
        const newUser = await UserServices.createUserService(req.body);

        // And then send the response with the new user data
        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "New user created successfully!",
            data: newUser
        })
    }
)





const getAllUsersController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        // To get all the users from the database now go to the service layer and get all the users
        const allUsers = await UserServices.getAllUsersService();

        // And then send the response with all the users data
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





const updateUserController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        // Get the userId from the params, the updated data from the request body, and the bearer token from the headers
        const userId = req.params.userId as string;
        const updatedData = req.body as Partial<UserInterface>;

        // Usually the bearer token can be found in the req.headers.authorization, but it's not yet verified.
        // But we don't want to verify the token once again here, because it has already been verified in the previous jwtRoleVerificationMiddleware.
        // So we simply saved the verified token in the modified request object req.userToken in the previous middleware.
        // So now we can get the verified token from the modified request object
        const verifiedToken = req.userToken as JwtPayload;

        // If the user is authorized, then send the necessary parameters to the service layer
        const updatedUser = await UserServices.updateUserService(userId, updatedData, verifiedToken);

        // Finally, send the response with the updated user data
        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User updated successfully!",
            data: updatedUser
        })
    }
)





// Named exports
export const UserControllers = {
    createUserController,
    getAllUsersController,
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
