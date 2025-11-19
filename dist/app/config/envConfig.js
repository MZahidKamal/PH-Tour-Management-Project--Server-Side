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
        'SSLCOMMERZ_STORE_ID',
        'SSLCOMMERZ_STORE_PASSWORD',
        'SSLCOMMERZ_PAYMENT_SESSION_API',
        'SSLCOMMERZ_PAYMENT_VALIDATION_WEBSERVICE_API',
        'SSLCOMMERZ_IPN_URL',
        'SSLCOMMERZ_PAYMENT_CURRENCY',
        'SSLCOMMERZ_BACKEND_SUCCESS_URL_PARTIAL',
        'SSLCOMMERZ_BACKEND_FAIL_URL_PARTIAL',
        'SSLCOMMERZ_BACKEND_CANCEL_URL_PARTIAL',
        'SSLCOMMERZ_FRONTEND_SUCCESS_URL_PARTIAL',
        'SSLCOMMERZ_FRONTEND_FAIL_URL_PARTIAL',
        'SSLCOMMERZ_FRONTEND_CANCEL_URL_PARTIAL',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'CLOUDINARY_URL',
        'NODEMAILER_SMTP_HOST',
        'NODEMAILER_SMTP_PORT',
        'GMAIL_ADDRESS',
        'GMAIL_APP_PASSWORD',
        'REDIS_USERNAME',
        'REDIS_PASSWORD',
        'REDIS_SOCKET_HOST',
        'REDIS_SOCKET_PORT',
        'OTP_EXPIRY_TIME',
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
        frontend_url: process.env.FRONTEND_URL,
        sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID,
        sslcommerz_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD,
        sslcommerz_payment_session_api: process.env.SSLCOMMERZ_PAYMENT_SESSION_API,
        sslcommerz_payment_validation_webservice_api: process.env.SSLCOMMERZ_PAYMENT_VALIDATION_WEBSERVICE_API,
        sslcommerz_ipn_url: process.env.SSLCOMMERZ_IPN_URL,
        sslcommerz_payment_currency: process.env.SSLCOMMERZ_PAYMENT_CURRENCY,
        sslcommerz_backend_success_url_partial: process.env.SSLCOMMERZ_BACKEND_SUCCESS_URL_PARTIAL,
        sslcommerz_backend_fail_url_partial: process.env.SSLCOMMERZ_BACKEND_FAIL_URL_PARTIAL,
        sslcommerz_backend_cancel_url_partial: process.env.SSLCOMMERZ_BACKEND_CANCEL_URL_PARTIAL,
        sslcommerz_frontend_success_url_partial: process.env.SSLCOMMERZ_FRONTEND_SUCCESS_URL_PARTIAL,
        sslcommerz_frontend_fail_url_partial: process.env.SSLCOMMERZ_FRONTEND_FAIL_URL_PARTIAL,
        sslcommerz_frontend_cancel_url_partial: process.env.SSLCOMMERZ_FRONTEND_CANCEL_URL_PARTIAL,
        cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
        cloudinary_url: process.env.CLOUDINARY_URL,
        nodemailer_smtp_host: process.env.NODEMAILER_SMTP_HOST,
        nodemailer_smtp_port: process.env.NODEMAILER_SMTP_PORT,
        gmail_address: process.env.GMAIL_ADDRESS,
        gmail_app_password: process.env.GMAIL_APP_PASSWORD,
        redis_username: process.env.REDIS_USERNAME,
        redis_password: process.env.REDIS_PASSWORD,
        redis_socket_host: process.env.REDIS_SOCKET_HOST,
        redis_socket_port: process.env.REDIS_SOCKET_PORT,
        otp_expiry_time: process.env.OTP_EXPIRY_TIME,
    };
};
/**
 * Configuration object containing environment-specific variables loaded from external sources.
 */
const envConfig = loadEnvVariables();
exports.default = envConfig;
