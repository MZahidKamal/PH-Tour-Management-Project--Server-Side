"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = require("mongoose");
const booking_interface_1 = require("./booking.interface");
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: [true, "User is required!"],
    },
    tourId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TourModel',
        required: [true, "Tour is required!"],
    },
    guestCount: {
        type: Number,
        required: [true, "Guest count is required!"],
    },
    status: {
        type: String,
        enum: Object.values(booking_interface_1.BookingStatusEnum),
        default: booking_interface_1.BookingStatusEnum.PENDING,
    },
    paymentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'PaymentModel',
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.BookingModel = (0, mongoose_1.model)('BookingModel', bookingSchema);
