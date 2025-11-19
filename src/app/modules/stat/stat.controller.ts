import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {NextFunction, Request, Response} from "express";
import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import {StatServices} from "./stat.service";





const getBookingStatsController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        const result = await StatServices.getBookingStatsService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking stats fetched successfully!",
            data: result
        })
    }
)





const getUserStatsController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        const result = await StatServices.getUserStatsService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User stats fetched successfully!",
            data: result
        })
    }
)





const getPaymentStatsController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        const result = await StatServices.getPaymentStatsService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Payment stats fetched successfully!",
            data: result
        })
    }
)





const getTourStatsController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        const result = await StatServices.getTourStatsService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour stats fetched successfully!",
            data: result
        })
    }
)





export const StatControllers = {
    getBookingStatsController,
    getPaymentStatsController,
    getUserStatsController,
    getTourStatsController
};
