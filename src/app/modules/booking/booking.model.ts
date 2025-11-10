import {model, Schema} from "mongoose";
import {BookingInterface, BookingStatusEnum} from "./booking.interface";





const bookingSchema = new Schema<BookingInterface>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'UserModel',
            required: [true, "User is required!"],
        },
        tourId: {
            type: Schema.Types.ObjectId,
            ref: 'TourModel',
            required: [true, "Tour is required!"],
        },
        guestCount: {
            type: Number,
            required: [true, "Guest count is required!"],
        },
        status: {
            type: String,
            enum: Object.values(BookingStatusEnum),
            default: BookingStatusEnum.PENDING,
        },
        paymentId: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentModel',
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)



export  const BookingModel = model<BookingInterface>('BookingModel', bookingSchema);
