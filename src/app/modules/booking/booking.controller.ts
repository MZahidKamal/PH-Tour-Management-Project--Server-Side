import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {NextFunction, Request, Response} from "express";
import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import {BookingServices} from "./booking.service";



const createBookingController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {


        const result = await BookingServices.createBookingService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Booking created successfully!",
            data: result
        })
    }
)



const getAllBookingsController = catchAsyncFunction(
    async (_req: Request, res: Response, _next: NextFunction) => {

        const result = await BookingServices.getAllBookingsService();

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All Booking fetched successfully!",
            data: result
        })
    }
)



const getUserBookingsController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await BookingServices.getUserBookingsService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User Booking fetched successfully!",
            data: result
        })
    }
)



const getSingleBookingController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await BookingServices.getSingleBookingService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Single Booking fetched successfully!",
            data: result
        })
    }
)



const updateBookingStatusController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await BookingServices.updateBookingStatusService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking Status Updated Successfully!",
            data: result
        })
    }
)



export const BookingControllers = {
    createBookingController,
    getAllBookingsController,
    getUserBookingsController,
    getSingleBookingController,
    updateBookingStatusController,
}
