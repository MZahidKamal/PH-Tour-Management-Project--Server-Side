import {NextFunction, Request, Response} from "express";



type AsyncFunctionType = (req: Request, res: Response, next: NextFunction) => Promise<void>



// Higher order function
const catchAsyncFunction = (fn: AsyncFunctionType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    }
}



export default catchAsyncFunction;










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
