import {optional, z} from "zod";





export const createATourTypeValidationZodSchema = z.object({
    name: z
        .string({error: "Tour type name must be a string"})
        .min(3, {message: "Tour type name must be at least 3 characters long"})
        .max(50, {message: "Tour type name must be at most 50 characters long"}),
});



export const updateATourTypeValidationZodSchema = z.object({
    name: z
        .string({error: "Tour type name must be a string"})
        .min(3, {message: "Tour type name must be at least 3 characters long"})
        .max(50, {message: "Tour type name must be at most 50 characters long"})
        .optional(),
});


export const createATourValidationZodSchema = z.object({
    title: z
        .string({error: "Tour title must be a string"})
        .min(3, {message: "Tour title must be at least 3 characters long"})
        .max(50, {message: "Tour title must be at most 50 characters long"}),
    description: z
        .string({error: "Tour description must be a string"})
        .min(10, {message: "Tour description must be at least 10 characters long"})
        .max(1000, {message: "Tour description must be at most 1000 characters long"}),
    location: z
        .string({error: "Tour location must be a string"})
        .min(3, {message: "Tour location must be at least 3 characters long"})
        .max(100, {message: "Tour location must be at most 100 characters long"}),
    costFrom: z
        .number({error: "Tour constFrom must be a number"})
        .min(10, {message: "Tour constFrom must be at least 10"}),
    departureLocation: z
        .string({error: "Tour departureLocation must be a string"})
        .min(3, {message: "Tour departureLocation must be at least 3 characters long"})
        .max(50, {message: "Tour departureLocation must be at most 100 characters long"}),
    arrivalLocation: z
        .string({error: "Tour arrivalLocation must be a string"})
        .min(3, {message: "Tour arrivalLocation must be at least 3 characters long"})
        .max(50, {message: "Tour arrivalLocation must be at most 100 characters long"}),
    startDate: z
        // .date({error: "Tour startDate must be a date"}),
        .string({error: "Tour startDate must be a string"}),
    endDate: z
        // .date({error: "Tour endDate must be a date"}),
        .string({error: "Tour endDate must be a string"}),
    included: z
        .array(z.string({error: "Tour included must be an array of strings"}))
        .min(1, {message: "Tour must have at least one included item"}),
    excluded: z
        .array(z.string({error: "Tour excluded must be an array of strings"}))
        .min(1, {message: "Tour must have at least one excluded item"}),
    amenities: z
        .array(z.string({error: "Tour amenities must be an array of strings"}))
        .min(1, {message: "Tour must have at least one amenity"}),
    tourPlan: z
        .array(z.string({error: "Tour tourPlan must be an array of strings"})),
    maxGuests: z
        .number({error: "Tour maxGuests must be a number"}),
    minAge: z
        .number({error: "Tour minAge must be a number"})
        .min(18, {message: "Tour minAge must be at least 18"}),
    division: z
        .string({error: "Tour division must be a string"}),
    tourType: z
        .string({error: "Tour tourType must be a string"})
});



export const updateATourValidationZodSchema = z.object({
    title: z
        .string({error: "Tour title must be a string"})
        .min(3, {message: "Tour title must be at least 3 characters long"})
        .max(50, {message: "Tour title must be at most 50 characters long"})
        .optional(),
    description: z
        .string({error: "Tour description must be a string"})
        .min(10, {message: "Tour description must be at least 10 characters long"})
        .max(1000, {message: "Tour description must be at most 1000 characters long"})
        .optional(),
    location: z
        .string({error: "Tour location must be a string"})
        .min(3, {message: "Tour location must be at least 3 characters long"})
        .max(100, {message: "Tour location must be at most 100 characters long"})
        .optional(),
    constFrom: z
        .number({error: "Tour constFrom must be a number"})
        .min(10, {message: "Tour constFrom must be at least 10"})
        .optional(),
    departureLocation: z
        .string({error: "Tour departureLocation must be a string"})
        .min(3, {message: "Tour departureLocation must be at least 3 characters long"})
        .max(50, {message: "Tour departureLocation must be at most 100 characters long"})
        .optional(),
    arrivalLocation: z
        .string({error: "Tour arrivalLocation must be a string"})
        .min(3, {message: "Tour arrivalLocation must be at least 3 characters long"})
        .max(50, {message: "Tour arrivalLocation must be at most 100 characters long"})
        .optional(),
    startDate: z
        // .date({error: "Tour startDate must be a date"})
        .string({error: "Tour startDate must be a string"})
        .optional(),
    endDate: z
        // .date({error: "Tour endDate must be a date"})
        .string({error: "Tour endDate must be a string"})
        .optional(),
    included: z
        .array(z.string({error: "Tour included must be an array of strings"}))
        .min(1, {message: "Tour must have at least one included item"})
        .optional(),
    excluded: z
        .array(z.string({error: "Tour excluded must be an array of strings"}))
        .min(1, {message: "Tour must have at least one excluded item"})
        .optional(),
    amenities: z
        .array(z.string({error: "Tour amenities must be an array of strings"}))
        .min(1, {message: "Tour must have at least one amenity"})
        .optional(),
    tourPlan: z
        .array(z.string({error: "Tour tourPlan must be an array of strings"}))
        .optional(),
    maxGuests: z
        .number({error: "Tour maxGuests must be a number"})
        .optional(),
    minAge: z
        .number({error: "Tour minAge must be a number"})
        .min(18, {message: "Tour minAge must be at least 18"})
        .optional(),
    division: z
        .string({error: "Tour division must be a string"})
        .optional(),
    tourType: z
        .string({error: "Tour tourType must be a string"})
        .optional(),
});
