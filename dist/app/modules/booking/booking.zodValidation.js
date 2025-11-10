"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingZodSchema = exports.createBookingZodSchema = void 0;
const zod_1 = require("zod");
const booking_interface_1 = require("./booking.interface");
exports.createBookingZodSchema = zod_1.z.object({
    tourId: zod_1.z
        .string({ error: "Tour ID must be a string" }),
    guestCount: zod_1.z
        .number({ error: "Guest count must be a number" })
        .int({ error: "Guest count must be an integer" })
        .positive({ error: "Guest count must be a positive number" })
        .min(1, { message: "Guest count must be at least 1" })
        .max(100, { message: "Guest count must be at most 10" }),
});
exports.updateBookingZodSchema = zod_1.z.object({
    status: zod_1.z
        .enum(Object.values(booking_interface_1.BookingStatusEnum))
});
