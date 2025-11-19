import {z} from "zod";
import {IsActiveEnum, RoleEnum} from "./user.interface";





export const createUserZodSchema = z.object({
    name: z
        .string({error: "Name must be a string"})
        .min(3, {message: "Name must be at least 3 characters long"})
        .max(20, {message: "Name must be at most 20 characters long"}),
    email: z
        .email({message: "Email must be a valid email address"})
        .min(3, {message: "Email must be at least 3 characters long"})
        .max(50, {message: "Email must be at most 50 characters long"}),
    password: z
        .string({error: "Password must be a string"})
        .min(8, {message: "Password must be at least 8 characters long"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter!"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter!"})
        .regex(/[@$!%*?&]/, {message: "Password must contain at least one special character!"})
        .optional(),
    phone: z
        .string({error: "Phone must be a string"})
        .regex(/^(?:\+49|0)(?:1[5-7]\d|[2-9]\d{1,4})(?:[ -]?\d{3,12})$/, {message: "Phone must be a valid German phone number, e.g. +49 151 2345678 or 030 1234567"})
        .optional(),
    address: z
        .string({error: "Address must be a string"})
        .max(100, {message: "Address must be at most 100 characters long"})
        .optional(),
});





export const updateUserZodSchema = z.object({
    name: z
        .string({error: "Name must be a string"})
        .min(3, {message: "Name must be at least 3 characters long"})
        .max(20, {message: "Name must be at most 20 characters long"})
        .optional(),

    /* Now we have separate api endpoints for updating password, so we don't need to do anything related to the password here.'
    password: z
        .string({error: "Password must be a string"})
        .min(8, {message: "Password must be at least 8 characters long"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter!"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter!"})
        .regex(/[@$!%*?&]/, {message: "Password must contain at least one special character!"})
        .optional(),*/
    phone: z
        .string({error: "Phone must be a string"})
        .regex(/^(?:\+49|0)(?:1[5-7]\d|[2-9]\d{1,4})(?:[ -]?\d{3,12})$/, {message: "Phone must be a valid German phone number, e.g. +49 151 2345678 or 030 1234567"})
        .optional(),
    address: z
        .string({error: "Address must be a string"})
        .max(100, {message: "Address must be at most 100 characters long"})
        .optional(),
    role: z
        .enum(Object.values(RoleEnum) as [string])
        .optional(),

    isDeleted: z
        .boolean({error: "isDeleted must be a boolean"})
        .optional(),
    isActive: z
        .enum(Object.values(IsActiveEnum) as [string])
        .optional(),
    isVerified: z
        .boolean({error: "isVerified must be a boolean"})
        .optional(),
});
