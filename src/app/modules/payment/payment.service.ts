/* eslint-disable @typescript-eslint/no-explicit-any */
import {BookingModel} from "../booking/booking.model";
import {PaymentModel} from "./payment.model";
import {PaymentStatusEnum} from "./payment.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import {BookingInterface, BookingStatusEnum} from "../booking/booking.interface";
import {consolePrint} from "../../utils/consolePrintFunction";
import {SSLCommerzServices} from "../sslCommerz/sslCommerz.service";
import UserModel from "../user/user.model";
import {SSLCommerzInterface} from "../sslCommerz/sslCommerz.interface";
import {UserInterface} from "../user/user.interface";
import {TourInterface} from "../tour/tour.interface";
import {generatePdfInvoice, InvoiceDataInterface} from "../../utils/generatePdfInvoiceFunction";
import sendAnEmailToTheUser from "../../config/nodemailer.config";
import {uploadAPDFBufferToCloudinary} from "../../config/cloudinary.config";
import {UploadApiResponse} from "cloudinary";





const successPaymentService = async (payload: any) => {

    // Update booking status to confirm
    // Update payment status to paid
    // We must use transaction rollback to avoid any incomplete set of actions

    const session = await BookingModel.startSession();
    session.startTransaction();

    try {
        // First we'll get the transactionId from the request query parameters'
        const transactionId = payload.query.transactionId;

        // Then using this transactionId, we'll find and update the payment document in the database'
        const paymentDocument = await PaymentModel.findOneAndUpdate(
            {transactionId},
            {status: PaymentStatusEnum.PAID},
            {new: true, runValidators: true, session}
        );

        // Then we'll check if the payment document is updated or not'
        if (paymentDocument?.status !== PaymentStatusEnum.PAID) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to paid!");
        }

        // Then we'll find and update the booking document in the database'
        const bookingDocument = await BookingModel.findByIdAndUpdate(
            paymentDocument.bookingId,
            {status: BookingStatusEnum.COMPLETED},
            {
                new: true,
                runValidators: true,
                populate: [
                    {
                        path: 'userId',
                        select: 'name email', // include only these fields
                    },
                    {
                        path: 'tourId',
                        select: 'title costFrom', // include only these fields
                    },
                ],
                session
            }
        )

        // Then we'll check if the booking document is updated or not'
        if (bookingDocument?.status !== BookingStatusEnum.COMPLETED) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update booking status to completed!");
        }

        // consolePrint('bookingDocument', bookingDocument);
        // consolePrint('paymentDocument', paymentDocument);

        // Then we'll generate the invoice data for this booking'
        const invoiceData = {
            transactionId: transactionId,
            bookingDate: (bookingDocument as BookingInterface)?.createdAt,
            customerName: ((bookingDocument as BookingInterface)?.userId as UserInterface)?.name,
            tourTitle: ((bookingDocument as BookingInterface)?.tourId as TourInterface)?.title,
            guestsCount: bookingDocument?.guestCount,
            totalAmount: paymentDocument?.amount,
        };

        // Then we'll create the invoice PDF buffered file using the invoice data'
        const pdfBuffer = await generatePdfInvoice(invoiceData as InvoiceDataInterface);

        // Then we'll upload the invoice PDF to Cloudinary'
        const cloudinaryResult: UploadApiResponse = await uploadAPDFBufferToCloudinary(pdfBuffer, 'invoice');

        // Then we'll update the invoiceUrl field in the payment document with the Cloudinary URL'
        const paymentDocumentUpdated = await PaymentModel.findByIdAndUpdate(
            paymentDocument._id,
            {invoiceUrl: cloudinaryResult?.secure_url},
            {
                runValidators: true,
                new: true,
                session
            }
        )
        if (!paymentDocumentUpdated){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update invoice URL in payment document!");
        }

        // Then we'll send the invoice PDF to the user's email'
        const emailResult = await sendAnEmailToTheUser({
            targetEmail: ((bookingDocument as BookingInterface)?.userId as UserInterface)?.email,
            emailSubject: "Tour Booking Confirmation and Invoice",
            emailTemplateName: 'tourBookingConfirmationAndInvoiceEmail.template.ejs',
            emailTemplateData: invoiceData,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                }
            ]
        })
        consolePrint('emailResult', emailResult?.accepted);

        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session'
        await session.commitTransaction();
        await session.endSession();

        // Then we'll return the success message'
        return {
            success: true,
            message: "Payment completed successfully!",
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to paid!");            // ❌ Don't use this.
        throw error;
    }
    finally {
        await session.endSession();
    }
};





const  failPaymentService = async (payload: any) => {

    // Update booking status to fail
    // Update payment status to fail
    // We must use transaction rollback to avoid any incomplete set of actions

    const session = await BookingModel.startSession();
    session.startTransaction();

    try {
        // First we'll get the transactionId from the request query parameters'
        const transactionId = payload.query.transactionId;

        // Then using this transactionId, we'll find and update the payment document in the database'
        const paymentDocument = await PaymentModel.findOneAndUpdate(
            {transactionId},
            {status: PaymentStatusEnum.FAILED},
            {new: true, runValidators: true, session}
        );

        // Then we'll check if the payment document is updated or not'
        if (paymentDocument?.status !== PaymentStatusEnum.FAILED) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to failed!");
        }

        // Then we'll find and update the booking document in the database'
        const bookingDocument = await BookingModel.findByIdAndUpdate(
            paymentDocument.bookingId,
            {status: BookingStatusEnum.FAILED},
            {new: true, runValidators: true, session}
        )

        // Then we'll check if the booking document is updated or not'
        if (bookingDocument?.status !== BookingStatusEnum.FAILED) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update booking status to failed!");
        }

        // consolePrint('bookingDocument', bookingDocument);
        // consolePrint('paymentDocument', paymentDocument);

        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session'
        await session.commitTransaction();
        await session.endSession();

        // Then we'll return the success message'
        return {
            success: true,
            message: "Payment status updated to failed!",
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to failed!");          // ❌ Don't use this.
        throw error;
    }
    finally {
        await session.endSession();
    }
};





const  cancelPaymentService = async (payload: any) => {
    // Update booking status to cancel
    // Update payment status to cancel
    // We must use transaction rollback to avoid any incomplete set of actions

    const session = await BookingModel.startSession();
    session.startTransaction();

    try {
        // First we'll get the transactionId from the request query parameters'
        const transactionId = payload.query.transactionId;

        // Then using this transactionId, we'll find and update the payment document in the database'
        const paymentDocument = await PaymentModel.findOneAndUpdate(
            {transactionId},
            {status: PaymentStatusEnum.CANCELLED},
            {new: true, runValidators: true, session}
        );

        // Then we'll check if the payment document is updated or not'
        if (paymentDocument?.status !== PaymentStatusEnum.CANCELLED) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to cancelled!");
        }

        // Then we'll find and update the booking document in the database'
        const bookingDocument = await BookingModel.findByIdAndUpdate(
            paymentDocument.bookingId,
            {status: BookingStatusEnum.CANCELLED},
            {new: true, runValidators: true, session}
        )

        // Then we'll check if the booking document is updated or not'
        if (bookingDocument?.status !== BookingStatusEnum.CANCELLED) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update booking status to cancelled!");
        }

        // consolePrint('bookingDocument', bookingDocument);
        // consolePrint('paymentDocument', paymentDocument);

        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session'
        await session.commitTransaction();
        await session.endSession();

        // Then we'll return the success message'
        return {
            success: true,
            message: "Payment status updated to cancelled!",
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to canceled!");        // ❌ Don't use this.
        throw error;
    }
    finally {
        await session.endSession();
    }
};





const  paymentVerificationIPSListenerService = async (payload: any) => {

    consolePrint('payload', payload.body);

    const result = await SSLCommerzServices.paymentVerification(payload.body);

    consolePrint('result', result);

    return {}
};





const  initializePaymentForABookingService = async (payload: any) => {
    // Update booking status to cancel
    // Update payment status to cancel
    // We must use transaction rollback to avoid any incomplete set of actions

    // First we'll create a transaction roller back session
    const session = await BookingModel.startSession();
    session.startTransaction();

    // Then we'll get the bookingId from the request params'
    const {bookingId} = payload.params;

    // Then we'll get the booking document from the database'
    const bookingDocument = await BookingModel.findById(bookingId)
    if (!bookingDocument) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }

    // Then we'll get the payment document from the database'
    const paymentDocument = await PaymentModel.findById(bookingDocument?.paymentId)
    if (!paymentDocument) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found!");
    }

    // Then we'll get the user profile from the database'
    const userDocument = await UserModel.findById(bookingDocument?.userId);
    if (!userDocument) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // Then we'll check if the booking document is already paid or not'
    if (bookingDocument.status === BookingStatusEnum.COMPLETED || paymentDocument.status === PaymentStatusEnum.PAID) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment already completed!");
    } else if (paymentDocument.status === PaymentStatusEnum.REFUNDED){
        throw new AppError(httpStatus.BAD_REQUEST, "Payment already refunded upon order cancellation!");
    }

    // Then we'll initialize the SSLCommerz payment again for this booking'
    // Let's construct the SSLCommerz payment initialization payload
    const sslPaymentInitializationPayload: SSLCommerzInterface = {
        amount: paymentDocument?.amount as number,
        transactionId: paymentDocument?.transactionId as string,
        name: userDocument?.name as string,
        email: userDocument?.email as string,
        phone: userDocument?.phone as string,
        address: userDocument?.address as string,
    }

    // Then we'll initialize the SSLCommerz payment'
    const sslPaymentInitialized = await SSLCommerzServices.paymentInitiation(sslPaymentInitializationPayload);

    // Finally we'll return the booking document along with the payment gateway page url'
    return {
        bookingInfo: bookingDocument,
        paymentUrl: sslPaymentInitialized?.GatewayPageURL
    };
};





const getInvoiceDownloadUrlService = async (payload: any): Promise<{ invoiceDownloadUrl: string }> => {

    // First we'll get the paymentId from the request params'
    const { paymentId } = payload.params;

    // Then, we'll get the payment document from the database'
    const paymentDocument = await PaymentModel.findById(paymentId)
        .select("invoiceUrl")
        .orFail(() => new AppError(httpStatus.NOT_FOUND, "Payment not found!"))
        .lean<{ invoiceUrl?: string }>();

    if (!paymentDocument.invoiceUrl) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invoice URL not found! Check if the payment is completed or not.");
    }

    // Finally, we'll retrieve the invoiceUrl from the payment document and return it to the client'
    return {
        invoiceDownloadUrl: paymentDocument.invoiceUrl,
    };
};





export const PaymentServices = {
    successPaymentService,
    failPaymentService,
    cancelPaymentService,
    paymentVerificationIPSListenerService,
    initializePaymentForABookingService,
    getInvoiceDownloadUrlService
};
