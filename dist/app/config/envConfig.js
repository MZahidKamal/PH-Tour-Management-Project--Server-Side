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
    const envVariables = [
        'NODE_ENVIRONMENT',
        'PORT',
        'MONGODB_URI',
        'BCRYPT_SALT_ROUNDS',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'REFRESH_JWT_SECRET',
        'REFRESH_JWT_EXPIRES_IN',
        'SUPER_ADMIN_NAME',
        'SUPER_ADMIN_EMAIL',
        'SUPER_ADMIN_PASSWORD',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_CALLBACK_URL',
        'EXPRESS_SESSION_SECRET',
        'FRONTEND_URL',
    ];
    const missingEnvVariables = envVariables.filter(envVariable => !process.env[envVariable]);
    if (missingEnvVariables.length > 0) {
        throw new Error(`Missing environment variables: ${missingEnvVariables.join(', ')}`);
    }
    return {
        node_environment: process.env.NODE_ENVIRONMENT, // It means it will either be DEVELOPMENT or be PRODUCTION.
        port: process.env.PORT,
        mongodb_uri: process.env.MONGODB_URI, // It means, it will neigher be NULL nor be UNDEFINED, rather be a STRING.
        bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
        jwt_secret: process.env.JWT_SECRET,
        jwt_expires_in: process.env.JWT_EXPIRES_IN,
        refresh_jwt_secret: process.env.REFRESH_JWT_SECRET,
        refresh_jwt_expires_in: process.env.REFRESH_JWT_EXPIRES_IN,
        super_admin_name: process.env.SUPER_ADMIN_NAME,
        super_admin_email: process.env.SUPER_ADMIN_EMAIL,
        super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
        google_client_id: process.env.GOOGLE_CLIENT_ID,
        google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
        google_callback_url: process.env.GOOGLE_CALLBACK_URL,
        express_session_secret: process.env.EXPRESS_SESSION_SECRET,
        frontend_url: process.env.FRONTEND_URL
    };
};
/**
 * Configuration object containing environment-specific variables loaded from external sources.
 */
const envConfig = loadEnvVariables();
exports.default = envConfig;
