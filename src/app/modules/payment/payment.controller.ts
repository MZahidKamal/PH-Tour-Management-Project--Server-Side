import catchAsyncFunction from "../../utils/catchAsyncFunction";
import {NextFunction, Request, Response} from "express";
import {PaymentServices} from "./payment.service";
import envConfig from "../../config/envConfig";
import sendResponseFunction from "../../utils/sendResponseFunction";
import httpStatus from "http-status-codes";
import {consolePrint} from "../../utils/consolePrintFunction";



const successPaymentController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const {transactionId, amount, status, success, message} = req.query;

        const result = await PaymentServices.successPaymentService(req);

        if (result?.success){
            res.redirect(`${envConfig.sslcommerz_frontend_success_url_partial}?transactionId=${transactionId}&amount=${amount}&status=${status}&success=${success}&message=${message}`)
        }
    }
)



const failPaymentController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const {transactionId, amount, status, success, message} = req.query;

        const result = await PaymentServices.failPaymentService(req);

        if (result?.success){
            res.redirect(`${envConfig.sslcommerz_frontend_fail_url_partial}?transactionId=${transactionId}&amount=${amount}&status=${status}&success=${success}&message=${message}`)
        }
    }
)



const cancelPaymentController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const {transactionId, amount, status, success, message} = req.query;

        const result = await PaymentServices.cancelPaymentService(req);

        if (result?.success){
            res.redirect(`${envConfig.sslcommerz_frontend_cancel_url_partial}?transactionId=${transactionId}&amount=${amount}&status=${status}&success=${success}&message=${message}`)
        }
    }
)



const initializePaymentForABookingController = catchAsyncFunction(
    async (req: Request, res: Response, _next: NextFunction) => {

        const result = await PaymentServices.initializePaymentForABookingService(req);

        sendResponseFunction(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Payment initiated successfully!",
            data: result
        })
    }
)



export const PaymentControllers = {
    successPaymentController,
    failPaymentController,
    cancelPaymentController,
    initializePaymentForABookingController,
};
