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
exports.PaymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const booking_model_1 = require("../booking/booking.model");
const payment_model_1 = require("./payment.model");
const payment_interface_1 = require("./payment.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_interface_1 = require("../booking/booking.interface");
const consolePrintFunction_1 = require("../../utils/consolePrintFunction");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const user_model_1 = __importDefault(require("../user/user.model"));
const generatePdfInvoiceFunction_1 = require("../../utils/generatePdfInvoiceFunction");
const nodemailer_config_1 = __importDefault(require("../../config/nodemailer.config"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const successPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Update booking status to confirm
    // Update payment status to paid
    // We must use transaction rollback to avoid any incomplete set of actions
    var _a, _b, _c;
    const session = yield booking_model_1.BookingModel.startSession();
    session.startTransaction();
    try {
        // First we'll get the transactionId from the request query parameters'
        const transactionId = payload.query.transactionId;
        // Then using this transactionId, we'll find and update the payment document in the database'
        const paymentDocument = yield payment_model_1.PaymentModel.findOneAndUpdate({ transactionId }, { status: payment_interface_1.PaymentStatusEnum.PAID }, { new: true, runValidators: true, session });
        // Then we'll check if the payment document is updated or not'
        if ((paymentDocument === null || paymentDocument === void 0 ? void 0 : paymentDocument.status) !== payment_interface_1.PaymentStatusEnum.PAID) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update payment status to paid!");
        }
        // Then we'll find and update the booking document in the database'
        const bookingDocument = yield booking_model_1.BookingModel.findByIdAndUpdate(paymentDocument.bookingId, { status: booking_interface_1.BookingStatusEnum.COMPLETED }, {
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
        });
        // Then we'll check if the booking document is updated or not'
        if ((bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.status) !== booking_interface_1.BookingStatusEnum.COMPLETED) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update booking status to completed!");
        }
        // consolePrint('bookingDocument', bookingDocument);
        // consolePrint('paymentDocument', paymentDocument);
        // Then we'll generate the invoice data for this booking'
        const invoiceData = {
            transactionId: transactionId,
            bookingDate: bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.createdAt,
            customerName: (_a = bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.userId) === null || _a === void 0 ? void 0 : _a.name,
            tourTitle: (_b = bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.tourId) === null || _b === void 0 ? void 0 : _b.title,
            guestsCount: bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.guestCount,
            totalAmount: paymentDocument === null || paymentDocument === void 0 ? void 0 : paymentDocument.amount,
        };
        // Then we'll create the invoice PDF buffered file using the invoice data'
        const pdfBuffer = yield (0, generatePdfInvoiceFunction_1.generatePdfInvoice)(invoiceData);
        // Then we'll upload the invoice PDF to Cloudinary'
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadAPDFBufferToCloudinary)(pdfBuffer, 'invoice');
        // Then we'll update the invoiceUrl field in the payment document with the Cloudinary URL'
        const paymentDocumentUpdated = yield payment_model_1.PaymentModel.findByIdAndUpdate(paymentDocument._id, { invoiceUrl: cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.secure_url }, {
            runValidators: true,
            new: true,
            session
        });
        if (!paymentDocumentUpdated) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update invoice URL in payment document!");
        }
        // Then we'll send the invoice PDF to the user's email'
        const emailResult = yield (0, nodemailer_config_1.default)({
            targetEmail: (_c = bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.userId) === null || _c === void 0 ? void 0 : _c.email,
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
        });
        (0, consolePrintFunction_1.consolePrint)('emailResult', emailResult === null || emailResult === void 0 ? void 0 : emailResult.accepted);
        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session'
        yield session.commitTransaction();
        yield session.endSession();
        // Then we'll return the success message'
        return {
            success: true,
            message: "Payment completed successfully!",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to paid!");            // ❌ Don't use this.
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const failPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Update booking status to fail
    // Update payment status to fail
    // We must use transaction rollback to avoid any incomplete set of actions
    const session = yield booking_model_1.BookingModel.startSession();
    session.startTransaction();
    try {
        // First we'll get the transactionId from the request query parameters'
        const transactionId = payload.query.transactionId;
        // Then using this transactionId, we'll find and update the payment document in the database'
        const paymentDocument = yield payment_model_1.PaymentModel.findOneAndUpdate({ transactionId }, { status: payment_interface_1.PaymentStatusEnum.FAILED }, { new: true, runValidators: true, session });
        // Then we'll check if the payment document is updated or not'
        if ((paymentDocument === null || paymentDocument === void 0 ? void 0 : paymentDocument.status) !== payment_interface_1.PaymentStatusEnum.FAILED) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update payment status to failed!");
        }
        // Then we'll find and update the booking document in the database'
        const bookingDocument = yield booking_model_1.BookingModel.findByIdAndUpdate(paymentDocument.bookingId, { status: booking_interface_1.BookingStatusEnum.FAILED }, { new: true, runValidators: true, session });
        // Then we'll check if the booking document is updated or not'
        if ((bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.status) !== booking_interface_1.BookingStatusEnum.FAILED) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update booking status to failed!");
        }
        // consolePrint('bookingDocument', bookingDocument);
        // consolePrint('paymentDocument', paymentDocument);
        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session'
        yield session.commitTransaction();
        yield session.endSession();
        // Then we'll return the success message'
        return {
            success: true,
            message: "Payment status updated to failed!",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to failed!");          // ❌ Don't use this.
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const cancelPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Update booking status to cancel
    // Update payment status to cancel
    // We must use transaction rollback to avoid any incomplete set of actions
    const session = yield booking_model_1.BookingModel.startSession();
    session.startTransaction();
    try {
        // First we'll get the transactionId from the request query parameters'
        const transactionId = payload.query.transactionId;
        // Then using this transactionId, we'll find and update the payment document in the database'
        const paymentDocument = yield payment_model_1.PaymentModel.findOneAndUpdate({ transactionId }, { status: payment_interface_1.PaymentStatusEnum.CANCELLED }, { new: true, runValidators: true, session });
        // Then we'll check if the payment document is updated or not'
        if ((paymentDocument === null || paymentDocument === void 0 ? void 0 : paymentDocument.status) !== payment_interface_1.PaymentStatusEnum.CANCELLED) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update payment status to cancelled!");
        }
        // Then we'll find and update the booking document in the database'
        const bookingDocument = yield booking_model_1.BookingModel.findByIdAndUpdate(paymentDocument.bookingId, { status: booking_interface_1.BookingStatusEnum.CANCELLED }, { new: true, runValidators: true, session });
        // Then we'll check if the booking document is updated or not'
        if ((bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.status) !== booking_interface_1.BookingStatusEnum.CANCELLED) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update booking status to cancelled!");
        }
        // consolePrint('bookingDocument', bookingDocument);
        // consolePrint('paymentDocument', paymentDocument);
        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session'
        yield session.commitTransaction();
        yield session.endSession();
        // Then we'll return the success message'
        return {
            success: true,
            message: "Payment status updated to cancelled!",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status to canceled!");        // ❌ Don't use this.
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const paymentVerificationIPSListenerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    (0, consolePrintFunction_1.consolePrint)('payload', payload.body);
    const result = yield sslCommerz_service_1.SSLCommerzServices.paymentVerification(payload.body);
    (0, consolePrintFunction_1.consolePrint)('result', result);
    return {};
});
const initializePaymentForABookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Update booking status to cancel
    // Update payment status to cancel
    // We must use transaction rollback to avoid any incomplete set of actions
    // First we'll create a transaction roller back session
    const session = yield booking_model_1.BookingModel.startSession();
    session.startTransaction();
    // Then we'll get the bookingId from the request params'
    const { bookingId } = payload.params;
    // Then we'll get the booking document from the database'
    const bookingDocument = yield booking_model_1.BookingModel.findById(bookingId);
    if (!bookingDocument) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found!");
    }
    // Then we'll get the payment document from the database'
    const paymentDocument = yield payment_model_1.PaymentModel.findById(bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.paymentId);
    if (!paymentDocument) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found!");
    }
    // Then we'll get the user profile from the database'
    const userDocument = yield user_model_1.default.findById(bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.userId);
    if (!userDocument) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // Then we'll check if the booking document is already paid or not'
    if (bookingDocument.status === booking_interface_1.BookingStatusEnum.COMPLETED || paymentDocument.status === payment_interface_1.PaymentStatusEnum.PAID) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment already completed!");
    }
    else if (paymentDocument.status === payment_interface_1.PaymentStatusEnum.REFUNDED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment already refunded upon order cancellation!");
    }
    // Then we'll initialize the SSLCommerz payment again for this booking'
    // Let's construct the SSLCommerz payment initialization payload
    const sslPaymentInitializationPayload = {
        amount: paymentDocument === null || paymentDocument === void 0 ? void 0 : paymentDocument.amount,
        transactionId: paymentDocument === null || paymentDocument === void 0 ? void 0 : paymentDocument.transactionId,
        name: userDocument === null || userDocument === void 0 ? void 0 : userDocument.name,
        email: userDocument === null || userDocument === void 0 ? void 0 : userDocument.email,
        phone: userDocument === null || userDocument === void 0 ? void 0 : userDocument.phone,
        address: userDocument === null || userDocument === void 0 ? void 0 : userDocument.address,
    };
    // Then we'll initialize the SSLCommerz payment'
    const sslPaymentInitialized = yield sslCommerz_service_1.SSLCommerzServices.paymentInitiation(sslPaymentInitializationPayload);
    // Finally we'll return the booking document along with the payment gateway page url'
    return {
        bookingInfo: bookingDocument,
        paymentUrl: sslPaymentInitialized === null || sslPaymentInitialized === void 0 ? void 0 : sslPaymentInitialized.GatewayPageURL
    };
});
const getInvoiceDownloadUrlService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First we'll get the paymentId from the request params'
    const { paymentId } = payload.params;
    // Then, we'll get the payment document from the database'
    const paymentDocument = yield payment_model_1.PaymentModel.findById(paymentId)
        .select("invoiceUrl")
        .orFail(() => new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found!"))
        .lean();
    if (!paymentDocument.invoiceUrl) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invoice URL not found! Check if the payment is completed or not.");
    }
    // Finally, we'll retrieve the invoiceUrl from the payment document and return it to the client'
    return {
        invoiceDownloadUrl: paymentDocument.invoiceUrl,
    };
});
exports.PaymentServices = {
    successPaymentService,
    failPaymentService,
    cancelPaymentService,
    paymentVerificationIPSListenerService,
    initializePaymentForABookingService,
    getInvoiceDownloadUrlService
};
