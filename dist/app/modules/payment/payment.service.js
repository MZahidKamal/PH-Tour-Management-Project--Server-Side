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
const booking_model_1 = require("../booking/booking.model");
const payment_model_1 = require("./payment.model");
const payment_interface_1 = require("./payment.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_interface_1 = require("../booking/booking.interface");
const consolePrintFunction_1 = require("../../utils/consolePrintFunction");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const user_model_1 = __importDefault(require("../user/user.model"));
const successPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Update booking status to confirm
    // Update payment status to paid
    // We must use transaction rollback to avoid any incomplete set of actions
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
        const bookingDocument = yield booking_model_1.BookingModel.findByIdAndUpdate(paymentDocument.bookingId, { status: booking_interface_1.BookingStatusEnum.COMPLETED }, { new: true, runValidators: true, session });
        // Then we'll check if the booking document is updated or not'
        if ((bookingDocument === null || bookingDocument === void 0 ? void 0 : bookingDocument.status) !== booking_interface_1.BookingStatusEnum.COMPLETED) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update booking status to completed!");
        }
        // consolePrint('bookingDocument', bookingDocument);
        // consolePrint('paymentDocument', paymentDocument);
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
const initializePaymentForABookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Update booking status to cancel
    // Update payment status to cancel
    // We must use transaction rollback to avoid any incomplete set of actions
    (0, consolePrintFunction_1.consolePrint)('initializePaymentForABookingService XX YY ZZ', payload);
    // First we'll create a transaction roller back session
    const session = yield booking_model_1.BookingModel.startSession();
    session.startTransaction();
    // Then we'll get the bookingId from the request params'
    const { bookingId } = payload.params;
    // Then we'll get the booking document from the database'
    const bookingDocument = yield booking_model_1.BookingModel.findById(bookingId)
        .populate('userId', 'name email phone address -_id');
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
exports.PaymentServices = {
    successPaymentService,
    failPaymentService,
    cancelPaymentService,
    initializePaymentForABookingService
};
