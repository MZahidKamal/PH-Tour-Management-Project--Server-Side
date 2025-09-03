import catchAsyncFunction from "../../utils/catchAsyncFunction";
import { NextFunction, Request, Response } from "express";
import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import {DivisionServices} from "./division.service";





const createADivisionController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await DivisionServices.createADivisionService(req.body);

        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Division created successfully!",
            data: result
        })

    }
)





const getAllDivisionsController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        const result = await DivisionServices.getAllDivisionsService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All divisions fetched successfully!",
            data: result
        })

    }
)





const getSingleDivisionController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await DivisionServices.getSingleDivisionService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Single division fetched successfully!",
            data: result
        })

    }
)





const updateADivisionController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await DivisionServices.updateADivisionService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Division updated successfully!",
            data: result
        })

    }
)





const deleteADivisionController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await DivisionServices.deleteADivisionService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Division deleted successfully!",
            data: result
        })

    }
)





export const DivisionControllers = {
    createADivisionController,
    getAllDivisionsController,
    getSingleDivisionController,
    updateADivisionController,
    deleteADivisionController,
}
