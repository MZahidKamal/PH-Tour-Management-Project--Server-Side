"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Name must be a string" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(20, { message: "Name must be at most 20 characters long" }),
    email: zod_1.z
        .email({ message: "Email must be a valid email address" })
        .min(3, { message: "Email must be at least 3 characters long" })
        .max(50, { message: "Email must be at most 50 characters long" }),
    password: zod_1.z
        .string({ error: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter!" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter!" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character!" })
        .optional(),
    phone: zod_1.z
        .string({ error: "Phone must be a string" })
        .regex(/^(?:\+49|0)(?:1[5-7]\d|[2-9]\d{1,4})(?:[ \-]?\d{3,12})$/, { message: "Phone must be a valid German phone number, e.g. +49 151 2345678 or 030 1234567" })
        .optional(),
    address: zod_1.z
        .string({ error: "Address must be a string" })
        .max(100, { message: "Address must be at most 100 characters long" })
        .optional(),
});
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Name must be a string" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(20, { message: "Name must be at most 20 characters long" })
        .optional(),
    password: zod_1.z
        .string({ error: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter!" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter!" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character!" })
        .optional(),
    phone: zod_1.z
        .string({ error: "Phone must be a string" })
        .regex(/^(?:\+49|0)(?:1[5-7]\d|[2-9]\d{1,4})(?:[ \-]?\d{3,12})$/, { message: "Phone must be a valid German phone number, e.g. +49 151 2345678 or 030 1234567" })
        .optional(),
    address: zod_1.z
        .string({ error: "Address must be a string" })
        .max(100, { message: "Address must be at most 100 characters long" })
        .optional(),
    role: zod_1.z
        .enum(Object.values(user_interface_1.RoleEnum))
        .optional(),
    isDeleted: zod_1.z
        .boolean({ error: "isDeleted must be a boolean" })
        .optional(),
    isActive: zod_1.z
        .enum(Object.values(user_interface_1.IsActiveEnum))
        .optional(),
    isVerified: zod_1.z
        .boolean({ error: "isVerified must be a boolean" })
        .optional(),
});
