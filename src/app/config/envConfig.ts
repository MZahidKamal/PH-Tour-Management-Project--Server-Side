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
    super_admin_name: string
    super_admin_email: string
    super_admin_password: string
}


/**
 * Loads necessary environment variables and validates their presence.
 * The function checks the required environment variables and ensures they are all defined
 * in the `process.env` object. If any of the required variables are missing, an error is thrown.
 * Returns an object containing the loaded environment variables if all required variables are present.
 */
const loadEnvVariables = (): EnvConfigInterface => {

    const envVariables: string[] = [
        'NODE_ENVIRONMENT',
        'PORT',
        'MONGODB_URI',
        'BCRYPT_SALT_ROUNDS',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'SUPER_ADMIN_NAME',
        'SUPER_ADMIN_EMAIL',
        'SUPER_ADMIN_PASSWORD',
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
        super_admin_name: process.env.SUPER_ADMIN_NAME as string,
        super_admin_email: process.env.SUPER_ADMIN_EMAIL as string,
        super_admin_password: process.env.SUPER_ADMIN_PASSWORD as string,
    }
}


/**
 * Configuration object containing environment-specific variables loaded from external sources.
 */
const envConfig: EnvConfigInterface = loadEnvVariables()


export default envConfig;
