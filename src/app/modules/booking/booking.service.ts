/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request} from "express";
import {consolePrint} from "../../utils/consolePrintFunction";
import {JwtPayload} from "jsonwebtoken";
import {BookingModel} from "./booking.model";
import {PaymentModel} from "../payment/payment.model";
import {TourModel} from "../tour/tour.model";
import UserModel from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import {generateTransactionId} from "../../utils/generateTransactionId";
import {SSLCommerzServices} from "../sslCommerz/sslCommerz.service";





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
const createBookingService = async (payload: Request) => {

    const transactionId = generateTransactionId()

    // Creating a transaction roller back session
    const session = await BookingModel.startSession();
    session.startTransaction();

    try {
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
        const newlyCreatedBooking = await BookingModel.create([{
            userId,
            tourId,
            guestCount,
        }], {session})

        // Then we'll check if the newly created booking is created or not'
        if (!newlyCreatedBooking[0]._id){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Booking creation failed!");
        }

        //Now we'll create a new payment for the newly created booking
        const newPaymentForThisBooking = await PaymentModel.create([{
            bookingId: newlyCreatedBooking[0]._id,
            transactionId: transactionId,
            amount: Number(guestCount) * Number(tourCost?.costFrom),
        }], {session})

        // Then we'll check if the newly created payment is created or not'.
        // If payment creation fails, then we'll delete the newly created booking
        if (!newPaymentForThisBooking[0]._id){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Payment creation failed!");
        }

        // Then we'll update the newly created booking with the paymentId
        const updatedBooking = await BookingModel.findByIdAndUpdate(
            newlyCreatedBooking[0]._id,
            {paymentId: newPaymentForThisBooking[0]._id},
            {new: true, runValidators: true, session}
        )
            .populate('userId', 'name email phone address -_id')
            .populate('tourId', 'name image location costFrom startDate endDate -_id')
            .populate('paymentId', 'transactionId amount status -_id')
            .lean<{
                userId?: {
                    name: string;
                    email: string;
                    phone?: string;
                    address?: string
                };
                paymentId?: {
                    transactionId: string;
                    amount: number
                };
            }>()
            // NOTE: .lean() tells Mongoose to return plain JavaScript objects instead of Mongoose Documents.

        // Then we'll construct the SSLCommerz payment initialization payload
        const sslPaymentInitializationPayload = {
            amount: updatedBooking?.paymentId?.amount ?? (Number(guestCount) * Number(tourCost?.costFrom)),
            transactionId: updatedBooking?.paymentId?.transactionId ?? transactionId,
            name: updatedBooking?.userId?.name ?? userProfile?.name,
            email: updatedBooking?.userId?.email ?? userProfile?.email,
            phone: updatedBooking?.userId?.phone ?? userProfile?.phone,
            address: updatedBooking?.userId?.address ?? userProfile?.address
        }

        // Then we'll initialize the SSLCommerz payment'
        const sslPaymentInitialized = await SSLCommerzServices.paymentInitiation(sslPaymentInitializationPayload);

        // Then we'll save the booking id into the user profile's bookings array'
        const userUpdateResult = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $push: { bookings: newlyCreatedBooking[0]._id } },
            { new: true, runValidators: true, session }
        );
        if (!userUpdateResult){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update user profile's bookings array!");
        }

        // Then we'll commit whatever we have done so far in this transaction roller back session, and will end the session
        await session.commitTransaction();
        await session.endSession();

        // Then we'll return the updated booking along with the payment gateway page url'
        return {
            bookingInfo: updatedBooking,
            paymentUrl: sslPaymentInitialized?.GatewayPageURL
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Booking creation failed!");                            // ❌ Don't use this.
        throw error;
    }
    finally {
        await session.endSession();
    }
}
// Same function but 1st one is without transaction roller back
// Same function but 2nd one is with transaction roller back


const getAllBookingsService = async () => {

    // We'll get all the bookings from the database'
    const allBookingsFromDatabase = await BookingModel.find({})
        .populate('userId', 'name email phone address -_id')
        .populate('tourId', 'name image location costFrom startDate endDate -_id')
        .populate('paymentId', 'transactionId amount status -_id')
        .lean()

    return allBookingsFromDatabase;
}




const getUserBookingsService = async (payload: any) => {
    consolePrint('getUserBookingsService', payload.body);
    return true;
}





const getSingleBookingService = async (payload: any) => {
    consolePrint('getSingleBookingService', payload.body);
    return true;
}





const updateBookingStatusService = async (payload: any) => {
    consolePrint('updateBookingStatusService', payload.body);
    return true;
}





export const BookingServices = {
    createBookingService,
    getAllBookingsService,
    getUserBookingsService,
    getSingleBookingService,
    updateBookingStatusService,
}
