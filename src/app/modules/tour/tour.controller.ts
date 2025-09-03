import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {NextFunction, Request, Response} from "express";
import httpStatus from "http-status-codes";
import sendResponseFunction from "../../utils/sendResponseFunction";
import {TourService} from "./tour.service";





const createATourTypeController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.createATourTypeService(req.body);

        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Tour type created successfully!",
            data: result
        })
    }
)



const getAllTourTypeController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.getAllTourTypesService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All tour types fetched successfully!",
            data: result
        })
    }
)



const updateATourTypeController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.updateATourTypeService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour type updated successfully!",
            data: result
        })
    }
)



const deleteATourTypeController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.deleteATourTypeService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour type deleted successfully!",
            data: result
        })
    }
)





const createATourController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.createATourService(req.body);

        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Tour created successfully!",
            data: result
        })
    }
)



const getSingleTourController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.getSingleTourService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Single tour fetched successfully!",
            data: result
        })
    }
)



const getAllToursController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.getAllToursService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All tours fetched successfully!",
            data: result
        })
    }
)



const updateATourController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.updateATourService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour updated successfully!",
            data: result
        })
    }
)



const deleteATourController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await TourService.deleteATourService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour deleted successfully!",
            data: result
        })
    }
)





export const TourControllers = {
    createATourTypeController,
    getAllTourTypeController,
    getSingleTourController,
    updateATourTypeController,
    deleteATourTypeController,

    createATourController,
    getAllToursController,
    updateATourController,
    deleteATourController
}
