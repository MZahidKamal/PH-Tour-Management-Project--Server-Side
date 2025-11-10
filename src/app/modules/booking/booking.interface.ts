// User - Booking(Pending) -> Payment (Unpaid) -> SSLCommerz -> Booking update = confirm -> Payment update = Paid

import {Types} from "mongoose";





export enum BookingStatusEnum {
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}





export interface BookingInterface {
    userId: Types.ObjectId;
    tourId: Types.ObjectId;
    guestCount: number;
    status: BookingStatusEnum;
    paymentId?: Types.ObjectId;
}
