"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateADivisionValidationZodSchema = exports.createADivisionValidationZodSchema = void 0;
const zod_1 = require("zod");
exports.createADivisionValidationZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Division name must be a string" })
        .min(3, { message: "Division name must be at least 3 characters long" })
        .max(20, { message: "Division name must be at most 20 characters long" }),
    thumbnail: zod_1.z
        .string({ error: "Division thumbnail must be a string" })
        .optional(),
    description: zod_1.z
        .string({ error: "Division description must be a string" })
        .min(10, { message: "Division description must be at least 10 characters long" })
        .max(1000, { message: "Division description must be at most 1000 characters long" })
        .optional(),
});
exports.updateADivisionValidationZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Division name must be a string" })
        .min(3, { message: "Division name must be at least 3 characters long" })
        .max(20, { message: "Division name must be at most 20 characters long" })
        .optional(),
    thumbnail: zod_1.z
        .string({ error: "Division thumbnail must be a string" })
        .optional(),
    description: zod_1.z
        .string({ error: "Division description must be a string" })
        .min(10, { message: "Division description must be at least 10 characters long" })
        .max(1000, { message: "Division description must be at most 1000 characters long" })
        .optional(),
});
