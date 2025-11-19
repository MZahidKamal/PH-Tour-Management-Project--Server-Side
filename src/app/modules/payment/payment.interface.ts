/* eslint-disable @typescript-eslint/no-explicit-any */
import {Types} from "mongoose";





export enum PaymentStatusEnum {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}





export interface PaymentInterface {
    bookingId: Types.ObjectId;
    transactionId: string;
    amount: number;
    paymentGatewayData?: any;
    invoiceUrl?: string;
    status: PaymentStatusEnum;
    createdAt?: Date;
}
