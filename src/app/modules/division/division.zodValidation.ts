import {z} from "zod";





export const createADivisionValidationZodSchema = z.object({
    name: z
        .string({error: "Division name must be a string"})
        .min(3, {message: "Division name must be at least 3 characters long"})
        .max(20, {message: "Division name must be at most 20 characters long"}),
    thumbnail: z
        .string({error: "Division thumbnail must be a string"})
        .optional(),
    description: z
        .string({error: "Division description must be a string"})
        .min(10, {message: "Division description must be at least 10 characters long"})
        .max(1000, {message: "Division description must be at most 1000 characters long"})
        .optional(),
});





export const updateADivisionValidationZodSchema = z.object({
    name: z
        .string({error: "Division name must be a string"})
        .min(3, {message: "Division name must be at least 3 characters long"})
        .max(20, {message: "Division name must be at most 20 characters long"})
        .optional(),
    thumbnail: z
        .string({error: "Division thumbnail must be a string"})
        .optional(),
    description: z
        .string({error: "Division description must be a string"})
        .min(10, {message: "Division description must be at least 10 characters long"})
        .max(1000, {message: "Division description must be at most 1000 characters long"})
        .optional(),
});
