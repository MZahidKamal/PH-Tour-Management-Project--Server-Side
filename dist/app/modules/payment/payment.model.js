"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'BookingModel',
        required: true,
        unique: [true, "Booking ID already exists!"],
    },
    transactionId: {
        type: String,
        required: [true, "Transaction ID is required!"],
        unique: [true, "Transaction ID already exists!"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required!"],
    },
    paymentGatewayData: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    invoiceUrl: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatusEnum),
        default: payment_interface_1.PaymentStatusEnum.UNPAID,
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.PaymentModel = (0, mongoose_1.model)('PaymentModel', paymentSchema);
