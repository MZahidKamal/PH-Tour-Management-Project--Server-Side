import {z} from "zod";





export const resetPasswordRequestZodSchema = z.object({
    email: z
        .email({message: "Email must be a valid email address"})
        .min(3, {message: "Email must be at least 3 characters long"})
        .max(50, {message: "Email must be at most 50 characters long"}),
});





export const resetPasswordFinalizationZodSchema = z.object({
    email: z
        .email({message: "Email must be a valid email address"})
        .min(3, {message: "Email must be at least 3 characters long"})
        .max(50, {message: "Email must be at most 50 characters long"}),
    newPassword: z
        .string({error: "New Password must be a string"})
        .min(8, {message: "New Password must be at least 8 characters long"})
        .regex(/[a-z]/, {message: "New Password must contain at least one lowercase letter!"})
        .regex(/[A-Z]/, {message: "New Password must contain at least one uppercase letter!"})
        .regex(/[@$!%*?&]/, {message: "New Password must contain at least one special character!"})
});
