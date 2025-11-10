import {z} from "zod";
import {BookingStatusEnum} from "./booking.interface";





export const createBookingZodSchema = z.object({
    tourId: z
        .string({error: "Tour ID must be a string"}),
    guestCount: z
        .number({error: "Guest count must be a number"})
        .int({error: "Guest count must be an integer"})
        .positive({error: "Guest count must be a positive number"})
        .min(1, {message: "Guest count must be at least 1"})
        .max(100, {message: "Guest count must be at most 10"}),
});





export const updateBookingZodSchema = z.object({
    status: z
        .enum(Object.values(BookingStatusEnum) as [string])
});
