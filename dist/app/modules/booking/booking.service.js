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
exports.BookingServices = void 0;
const consolePrintFunction_1 = require("../../utils/consolePrintFunction");
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const generateTransactionId_1 = require("../../utils/generateTransactionId");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
/*const createBookingService = async (payload: Request) => {

    // First we'll get the userId from the JWT access token stored in the request
    const loggedInUserToken = payload.userToken as JwtPayload;
    const userId = loggedInUserToken.userId as string;
    const userProfile = await UserModel.findById(userId);

    // Then we'll check if the user profile is completed or not
    if (!userProfile?.phone || !userProfile?.address){
        throw new AppError(httpStatus.BAD_REQUEST, "Please complete your profile to book a tour!");
    }

    // Then we'll get the tourId and guestCount from the request body'
    const {tourId, guestCount} = payload.body;

    // Now we'll get the tour's costFrom from the database
    const tourCost = await TourModel.findById(tourId).select('costFrom');
    if (!tourCost){
        throw new AppError(httpStatus.NOT_FOUND, "Tour cost not found!");
    }

    // Now we'll create a new booking for the user with the provided tourId and guestCount
    const newlyCreatedBooking = await BookingModel.create({
        userId,
        tourId,
        guestCount,
    })

    // Then we'll check if the newly created booking is created or not'
    if (!newlyCreatedBooking._id){
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Booking creation failed!");
    }

    //Now we'll create a new payment for the newly created booking
    const newPaymentForThisBooking = await PaymentModel.create({
        // bookingId: newlyCreatedBooking._id,
        transactionId: generateTransactionId(),
        amount: Number(guestCount) * Number(tourCost?.costFrom),
    })

    // Then we'll check if the newly created payment is created or not'.
    // If payment creation fails, then we'll delete the newly created booking
    if (!newPaymentForThisBooking._id){
        await BookingModel.findByIdAndDelete(newlyCreatedBooking._id);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Payment creation failed!");
    }

    // Then we'll update the newly created booking with the paymentId
    const updatedBooking = await BookingModel.findByIdAndUpdate(
        newlyCreatedBooking._id,
        {paymentId: newPaymentForThisBooking._id},
        {new: true, runValidators: true}
    )
        .populate('userId', 'name email phone address -_id')
        .populate('tourId', 'name image location costFrom startDate endDate -_id')
        .populate('paymentId', 'transactionId amount status -_id')

    // Then we'll return the updated booking'
    return updatedBooking;
}*/
const createBookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const transactionId = (0, generateTransactionId_1.generateTransactionId)();
    // Creating a transaction roller back session
    const session = yield booking_model_1.BookingModel.startSession();
    session.startTransaction();
    try {
        // First we'll get the userId from the JWT access token stored in the request
        const loggedInUserToken = payload.userToken;
        const userId = loggedInUserToken.userId;
        const userProfile = yield user_model_1.default.findById(userId);
        // Then we'll check if the user profile is completed or not
        if (!(userProfile === null || userProfile === void 0 ? void 0 : userProfile.phone) || !(userProfile === null || userProfile === void 0 ? void 0 : userProfile.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please complete your profile to book a tour!");
        }
        // Then we'll get the tourId and guestCount from the request body'
        const { tourId, guestCount } = payload.body;
        // Now we'll get the tour's costFrom from the database
        const tourCost = yield tour_model_1.TourModel.findById(tourId).select('costFrom');
        if (!tourCost) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour cost not found!");
        }
        // Now we'll create a new booking for the user with the provided tourId and guestCount
        const newlyCreatedBooking = yield booking_model_1.BookingModel.create([{
                userId,
                tourId,
                guestCount,
            }], { session });
        // Then we'll check if the newly created booking is created or not'
        if (!newlyCreatedBooking[0]._id) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Booking creation failed!");
        }
        //Now we'll create a new payment for the newly created booking
        const newPaymentForThisBooking = yield payment_model_1.PaymentModel.create([{
                bookingId: newlyCreatedBooking[0]._id,
                transactionId: transactionId,
                amount: Number(guestCount) * Number(tourCost === null || tourCost === void 0 ? void 0 : tourCost.costFrom),
            }], { session });
        // Then we'll check if the newly created payment is created or not'.
        // If payment creation fails, then we'll delete the newly created booking
        if (!newPaymentForThisBooking[0]._id) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Payment creation failed!");
        }
        // Then we'll update the newly created booking with the paymentId
        const updatedBooking = yield booking_model_1.BookingModel.findByIdAndUpdate(newlyCreatedBooking[0]._id, { paymentId: newPaymentForThisBooking[0]._id }, { new: true, runValidators: true, session })
            .populate('userId', 'name email phone address -_id')
            .populate('tourId', 'name image location costFrom startDate endDate -_id')
            .populate('paymentId', 'transactionId amount status -_id')
            .lean();
        // NOTE: .lean() tells Mongoose to return plain JavaScript objects instead of Mongoose Documents.
        // Then we'll construct the SSLCommerz payment initialization payload
        const sslPaymentInitializationPayload = {
            amount: (_b = (_a = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.paymentId) === null || _a === void 0 ? void 0 : _a.amount) !== null && _b !== void 0 ? _b : (Number(guestCount) * Number(tourCost === null || tourCost === void 0 ? void 0 : tourCost.costFrom)),
            transactionId: (_d = (_c = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.paymentId) === null || _c === void 0 ? void 0 : _c.transactionId) !== null && _d !== void 0 ? _d : transactionId,
            name: (_f = (_e = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.userId) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : userProfile === null || userProfile === void 0 ? void 0 : userProfile.name,
            email: (_h = (_g = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.userId) === null || _g === void 0 ? void 0 : _g.email) !== null && _h !== void 0 ? _h : userProfile === null || userProfile === void 0 ? void 0 : userProfile.email,
            phone: (_k = (_j = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.userId) === null || _j === void 0 ? void 0 : _j.phone) !== null && _k !== void 0 ? _k : userProfile === null || userProfile === void 0 ? void 0 : userProfile.phone,
            address: (_m = (_l = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.userId) === null || _l === void 0 ? void 0 : _l.address) !== null && _m !== void 0 ? _m : userProfile === null || userProfile === void 0 ? void 0 : userProfile.address
        };
        // Then we'll initialize the SSLCommerz payment'
        const sslPaymentInitialized = yield sslCommerz_service_1.SSLCommerzServices.paymentInitiation(sslPaymentInitializationPayload);
        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session
        yield session.commitTransaction();
        yield session.endSession();
        // Then we'll return the updated booking along with the payment gateway page url'
        return {
            bookingInfo: updatedBooking,
            paymentUrl: sslPaymentInitialized === null || sslPaymentInitialized === void 0 ? void 0 : sslPaymentInitialized.GatewayPageURL
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Booking creation failed!");                            // ❌ Don't use this.
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
// Same function but 1st one is without transaction roller back
// Same function but 2nd one is with transaction roller back
const getAllBookingsService = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, consolePrintFunction_1.consolePrint)('getAllBookingsService');
    return true;
});
const getUserBookingsService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    (0, consolePrintFunction_1.consolePrint)('getUserBookingsService');
    return true;
});
const getSingleBookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    (0, consolePrintFunction_1.consolePrint)('getSingleBookingService');
    return true;
});
const updateBookingStatusService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    (0, consolePrintFunction_1.consolePrint)('updateBookingStatusService');
    return true;
});
exports.BookingServices = {
    createBookingService,
    getAllBookingsService,
    getUserBookingsService,
    getSingleBookingService,
    updateBookingStatusService,
};
