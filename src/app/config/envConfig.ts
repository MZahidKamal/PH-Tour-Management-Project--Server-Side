import dotenv from 'dotenv';


dotenv.config();


/**
 * EnvConfigInterface defines the structure for the environment configuration object required by the application.
 */
interface EnvConfigInterface {
    node_environment: "development" | "production",
    port: string,
    mongodb_uri: string,
}


/**
 * Loads necessary environment variables and validates their presence.
 * The function checks the required environment variables and ensures they are all defined
 * in the `process.env` object. If any of the required variables are missing, an error is thrown.
 * Returns an object containing the loaded environment variables if all required variables are present.
 */
const loadEnvVariables = (): EnvConfigInterface => {

    const envVariables: string[] = ['NODE_ENVIRONMENT', 'PORT', 'MONGODB_URI'];

    const missingEnvVariables: string[] = envVariables.filter(envVariable => !process.env[envVariable]);

    if (missingEnvVariables.length > 0) {
        throw new Error(`Missing environment variables: ${missingEnvVariables.join(', ')}`);
    }

    return {
        node_environment: process.env.NODE_ENVIRONMENT as "development" | "production",         // It means it will either be DEVELOPMENT or be PRODUCTION.
        port: process.env.PORT as string,
        mongodb_uri: process.env.MONGODB_URI as string,                                        // It means, it will neigher be NULL nor be UNDEFINED, rather be a STRING.
    }
}


/**
 * Configuration object containing environment-specific variables loaded from external sources.
 */
const envConfig: EnvConfigInterface = loadEnvVariables()


export default envConfig;
