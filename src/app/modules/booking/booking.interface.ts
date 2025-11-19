// User - Booking(Pending) -> Payment (Unpaid) -> SSLCommerz -> Booking update = confirm -> Payment update = Paid

import {Types} from "mongoose";
import {UserInterface} from "../user/user.interface";
import {TourInterface} from "../tour/tour.interface";





export enum BookingStatusEnum {
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}





export interface BookingInterface {
    userId: Types.ObjectId | UserInterface;
    tourId: Types.ObjectId | TourInterface;
    guestCount: number;
    status: BookingStatusEnum;
    paymentId?: Types.ObjectId;
    createdAt?: Date;
}
