import dotenv from 'dotenv';


dotenv.config();


/**
 * EnvConfigInterface defines the structure for the environment configuration object required by the application.
 */
interface EnvConfigInterface {
    node_environment: "development" | "production",
    port: string,
    mongodb_uri: string
    bcrypt_salt_rounds: string
    jwt_secret: string
    jwt_expires_in: string | number
    refresh_jwt_secret: string
    refresh_jwt_expires_in: string | number
    super_admin_name: string
    super_admin_email: string
    super_admin_password: string
    google_client_id: string
    google_client_secret: string
    google_callback_url: string
    express_session_secret: string
    frontend_url: string
    sslcommerz_store_id: string
    sslcommerz_store_password: string
    sslcommerz_payment_session_api: string
    sslcommerz_payment_validation_webservice_api: string
    sslcommerz_ipn_url: string
    sslcommerz_payment_currency: string
    sslcommerz_backend_success_url_partial: string
    sslcommerz_backend_fail_url_partial: string
    sslcommerz_backend_cancel_url_partial: string
    sslcommerz_frontend_success_url_partial: string
    sslcommerz_frontend_fail_url_partial: string
    sslcommerz_frontend_cancel_url_partial: string
    cloudinary_cloud_name: string
    cloudinary_api_key: string
    cloudinary_api_secret: string
    cloudinary_url: string
    nodemailer_smtp_host: string
    nodemailer_smtp_port: string
    gmail_address: string
    gmail_app_password: string
    redis_username: string
    redis_password: string
    redis_socket_host: string
    redis_socket_port: string
    otp_expiry_time: string | number
}


/**
 * Loads necessary environment variables and validates their presence.
 * The function checks the required environment variables and ensures they are all defined
 * in the `process.env` object. If any of the required variables are missing, an error is thrown.
 * Returns an object containing the loaded environment variables if all required variables are present.
 */
const loadEnvVariables: () => EnvConfigInterface = (): EnvConfigInterface => {

    const envVariables: string[] = [
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

    const missingEnvVariables: string[] = envVariables.filter(envVariable => !process.env[envVariable]);

    if (missingEnvVariables.length > 0) {
        throw new Error(`Missing environment variables: ${missingEnvVariables.join(', ')}`);
    }

    return {
        node_environment: process.env.NODE_ENVIRONMENT as "development" | "production",         // It means it will either be DEVELOPMENT or be PRODUCTION.
        port: process.env.PORT as string,
        mongodb_uri: process.env.MONGODB_URI as string,                                        // It means, it will neigher be NULL nor be UNDEFINED, rather be a STRING.
        bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS as string,
        jwt_secret: process.env.JWT_SECRET as string,
        jwt_expires_in: process.env.JWT_EXPIRES_IN as string | number,
        refresh_jwt_secret: process.env.REFRESH_JWT_SECRET as string,
        refresh_jwt_expires_in: process.env.REFRESH_JWT_EXPIRES_IN as string | number,
        super_admin_name: process.env.SUPER_ADMIN_NAME as string,
        super_admin_email: process.env.SUPER_ADMIN_EMAIL as string,
        super_admin_password: process.env.SUPER_ADMIN_PASSWORD as string,
        google_client_id: process.env.GOOGLE_CLIENT_ID as string,
        google_client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        google_callback_url: process.env.GOOGLE_CALLBACK_URL as string,
        express_session_secret: process.env.EXPRESS_SESSION_SECRET as string,
        frontend_url: process.env.FRONTEND_URL as string,
        sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID as string,
        sslcommerz_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD as string,
        sslcommerz_payment_session_api: process.env.SSLCOMMERZ_PAYMENT_SESSION_API as string,
        sslcommerz_payment_validation_webservice_api: process.env.SSLCOMMERZ_PAYMENT_VALIDATION_WEBSERVICE_API as string,
        sslcommerz_ipn_url: process.env.SSLCOMMERZ_IPN_URL as string,
        sslcommerz_payment_currency: process.env.SSLCOMMERZ_PAYMENT_CURRENCY as string,
        sslcommerz_backend_success_url_partial: process.env.SSLCOMMERZ_BACKEND_SUCCESS_URL_PARTIAL as string,
        sslcommerz_backend_fail_url_partial: process.env.SSLCOMMERZ_BACKEND_FAIL_URL_PARTIAL as string,
        sslcommerz_backend_cancel_url_partial: process.env.SSLCOMMERZ_BACKEND_CANCEL_URL_PARTIAL as string,
        sslcommerz_frontend_success_url_partial: process.env.SSLCOMMERZ_FRONTEND_SUCCESS_URL_PARTIAL as string,
        sslcommerz_frontend_fail_url_partial: process.env.SSLCOMMERZ_FRONTEND_FAIL_URL_PARTIAL as string,
        sslcommerz_frontend_cancel_url_partial: process.env.SSLCOMMERZ_FRONTEND_CANCEL_URL_PARTIAL as string,
        cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string,
        cloudinary_url: process.env.CLOUDINARY_URL as string,
        nodemailer_smtp_host: process.env.NODEMAILER_SMTP_HOST as string,
        nodemailer_smtp_port: process.env.NODEMAILER_SMTP_PORT as string,
        gmail_address: process.env.GMAIL_ADDRESS as string,
        gmail_app_password: process.env.GMAIL_APP_PASSWORD as string,
        redis_username: process.env.REDIS_USERNAME as string,
        redis_password: process.env.REDIS_PASSWORD as string,
        redis_socket_host: process.env.REDIS_SOCKET_HOST as string,
        redis_socket_port: process.env.REDIS_SOCKET_PORT as string,
        otp_expiry_time: process.env.OTP_EXPIRY_TIME as string | number,
    }
}


/**
 * Configuration object containing environment-specific variables loaded from external sources.
 */
const envConfig: EnvConfigInterface = loadEnvVariables()


export default envConfig;
