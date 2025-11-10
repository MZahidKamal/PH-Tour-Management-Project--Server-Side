"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateATourValidationZodSchema = exports.createATourValidationZodSchema = exports.updateATourTypeValidationZodSchema = exports.createATourTypeValidationZodSchema = void 0;
const zod_1 = require("zod");
exports.createATourTypeValidationZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Tour type name must be a string" })
        .min(3, { message: "Tour type name must be at least 3 characters long" })
        .max(50, { message: "Tour type name must be at most 50 characters long" }),
});
exports.updateATourTypeValidationZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Tour type name must be a string" })
        .min(3, { message: "Tour type name must be at least 3 characters long" })
        .max(50, { message: "Tour type name must be at most 50 characters long" })
        .optional(),
});
exports.createATourValidationZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ error: "Tour title must be a string" })
        .min(3, { message: "Tour title must be at least 3 characters long" })
        .max(50, { message: "Tour title must be at most 50 characters long" }),
    description: zod_1.z
        .string({ error: "Tour description must be a string" })
        .min(10, { message: "Tour description must be at least 10 characters long" })
        .max(1000, { message: "Tour description must be at most 1000 characters long" }),
    location: zod_1.z
        .string({ error: "Tour location must be a string" })
        .min(3, { message: "Tour location must be at least 3 characters long" })
        .max(100, { message: "Tour location must be at most 100 characters long" }),
    costFrom: zod_1.z
        .number({ error: "Tour constFrom must be a number" })
        .min(10, { message: "Tour constFrom must be at least 10" }),
    departureLocation: zod_1.z
        .string({ error: "Tour departureLocation must be a string" })
        .min(3, { message: "Tour departureLocation must be at least 3 characters long" })
        .max(50, { message: "Tour departureLocation must be at most 100 characters long" }),
    arrivalLocation: zod_1.z
        .string({ error: "Tour arrivalLocation must be a string" })
        .min(3, { message: "Tour arrivalLocation must be at least 3 characters long" })
        .max(50, { message: "Tour arrivalLocation must be at most 100 characters long" }),
    startDate: zod_1.z
        // .date({error: "Tour startDate must be a date"}),
        .string({ error: "Tour startDate must be a string" }),
    endDate: zod_1.z
        // .date({error: "Tour endDate must be a date"}),
        .string({ error: "Tour endDate must be a string" }),
    included: zod_1.z
        .array(zod_1.z.string({ error: "Tour included must be an array of strings" }))
        .min(1, { message: "Tour must have at least one included item" }),
    excluded: zod_1.z
        .array(zod_1.z.string({ error: "Tour excluded must be an array of strings" }))
        .min(1, { message: "Tour must have at least one excluded item" }),
    amenities: zod_1.z
        .array(zod_1.z.string({ error: "Tour amenities must be an array of strings" }))
        .min(1, { message: "Tour must have at least one amenity" }),
    tourPlan: zod_1.z
        .array(zod_1.z.string({ error: "Tour tourPlan must be an array of strings" })),
    maxGuests: zod_1.z
        .number({ error: "Tour maxGuests must be a number" }),
    minAge: zod_1.z
        .number({ error: "Tour minAge must be a number" })
        .min(18, { message: "Tour minAge must be at least 18" }),
    division: zod_1.z
        .string({ error: "Tour division must be a string" }),
    tourType: zod_1.z
        .string({ error: "Tour tourType must be a string" })
});
exports.updateATourValidationZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ error: "Tour title must be a string" })
        .min(3, { message: "Tour title must be at least 3 characters long" })
        .max(50, { message: "Tour title must be at most 50 characters long" })
        .optional(),
    description: zod_1.z
        .string({ error: "Tour description must be a string" })
        .min(10, { message: "Tour description must be at least 10 characters long" })
        .max(1000, { message: "Tour description must be at most 1000 characters long" })
        .optional(),
    location: zod_1.z
        .string({ error: "Tour location must be a string" })
        .min(3, { message: "Tour location must be at least 3 characters long" })
        .max(100, { message: "Tour location must be at most 100 characters long" })
        .optional(),
    constFrom: zod_1.z
        .number({ error: "Tour constFrom must be a number" })
        .min(10, { message: "Tour constFrom must be at least 10" })
        .optional(),
    departureLocation: zod_1.z
        .string({ error: "Tour departureLocation must be a string" })
        .min(3, { message: "Tour departureLocation must be at least 3 characters long" })
        .max(50, { message: "Tour departureLocation must be at most 100 characters long" })
        .optional(),
    arrivalLocation: zod_1.z
        .string({ error: "Tour arrivalLocation must be a string" })
        .min(3, { message: "Tour arrivalLocation must be at least 3 characters long" })
        .max(50, { message: "Tour arrivalLocation must be at most 100 characters long" })
        .optional(),
    startDate: zod_1.z
        // .date({error: "Tour startDate must be a date"})
        .string({ error: "Tour startDate must be a string" })
        .optional(),
    endDate: zod_1.z
        // .date({error: "Tour endDate must be a date"})
        .string({ error: "Tour endDate must be a string" })
        .optional(),
    included: zod_1.z
        .array(zod_1.z.string({ error: "Tour included must be an array of strings" }))
        .min(1, { message: "Tour must have at least one included item" })
        .optional(),
    excluded: zod_1.z
        .array(zod_1.z.string({ error: "Tour excluded must be an array of strings" }))
        .min(1, { message: "Tour must have at least one excluded item" })
        .optional(),
    amenities: zod_1.z
        .array(zod_1.z.string({ error: "Tour amenities must be an array of strings" }))
        .min(1, { message: "Tour must have at least one amenity" })
        .optional(),
    tourPlan: zod_1.z
        .array(zod_1.z.string({ error: "Tour tourPlan must be an array of strings" }))
        .optional(),
    maxGuests: zod_1.z
        .number({ error: "Tour maxGuests must be a number" })
        .optional(),
    minAge: zod_1.z
        .number({ error: "Tour minAge must be a number" })
        .min(18, { message: "Tour minAge must be at least 18" })
        .optional(),
    division: zod_1.z
        .string({ error: "Tour division must be a string" })
        .optional(),
    tourType: zod_1.z
        .string({ error: "Tour tourType must be a string" })
        .optional(),
});
