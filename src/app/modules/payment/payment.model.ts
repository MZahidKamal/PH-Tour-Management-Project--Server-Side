import {model, Schema} from "mongoose";
import {PaymentInterface, PaymentStatusEnum} from "./payment.interface";





const paymentSchema = new Schema<PaymentInterface>({
        bookingId: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.Mixed,
        },
        invoiceUrl: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatusEnum),
            default: PaymentStatusEnum.UNPAID,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)



export const PaymentModel = model<PaymentInterface>('PaymentModel', paymentSchema);
