"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Loads necessary environment variables and validates their presence.
 * The function checks the required environment variables and ensures they are all defined
 * in the `process.env` object. If any of the required variables are missing, an error is thrown.
 * Returns an object containing the loaded environment variables if all required variables are present.
 */
const loadEnvVariables = () => {
    const envVariables = ['NODE_ENVIRONMENT', 'PORT', 'MONGODB_URI'];
    const missingEnvVariables = envVariables.filter(envVariable => !process.env[envVariable]);
    if (missingEnvVariables.length > 0) {
        throw new Error(`Missing environment variables: ${missingEnvVariables.join(', ')}`);
    }
    return {
        node_environment: process.env.NODE_ENVIRONMENT, // It means it will either be DEVELOPMENT or be PRODUCTION.
        port: process.env.PORT,
        mongodb_uri: process.env.MONGODB_URI, // It means, it will neigher be NULL nor be UNDEFINED, rather be a STRING.
    };
};
/**
 * Configuration object containing environment-specific variables loaded from external sources.
 */
const envConfig = loadEnvVariables();
exports.default = envConfig;
