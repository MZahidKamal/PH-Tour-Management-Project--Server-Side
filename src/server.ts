import {Server} from 'http';
import mongoose from 'mongoose';
import envConfig from './app/config/envConfig';
import app from './app';
import seedSuperAdminFunction from "./app/utils/seedSuperAdminFunction";
import {consolePrint} from "./app/utils/consolePrintFunction";



let server: Server;



const startServer = async () => {
    try {

        // Connecting to MongoDB, using the Mongoose package.
        const database = await mongoose.connect(envConfig.mongodb_uri as string);
        if (database) consolePrint('✅ Connected to MongoDB successfully!');
        else consolePrint('❌ Failed to connect to MongoDB!');

        // Starting the server to see the output in the browser.
        server = app.listen(envConfig.port, (): void => {
            consolePrint(`✅ PH Tour Management Project - Server Side, is listening on port ${envConfig.port}`);
        })

    }
    catch (error) {
        consolePrint(error);
    }
};



(async ()=>{
    await startServer();
    await seedSuperAdminFunction();
})()
/* This is an IIFE (Immediately Invoked Function Expression) function to run the startServer function immediately
and then run the seedSuperAdminFunction function immediately.
Only after the server is completely started, the `seedSuperAdminFunction` is called.
This is important because you want to make sure the server (and thus the database connection) is fully established
before trying to create the super admin user, as the `seedSuperAdminFunction` requires a database connection to work
with the `UserModel`. */








// Unhandled Rejection Error Handling
process.on('unhandledRejection', (error: unknown) => {

    if (error instanceof Error) {
        consolePrint('Unhandled Rejection detected! Error: ', error.message)
    } else {
        consolePrint('Unhandled Rejection detected! Error: ', error)
    }

    // Graceful shutdown.
    if (server) {
        consolePrint('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    } else {
        consolePrint('⚠️ Server closed gracefully!');
        process.exit(1);
    }
})
// Activate this code line to test the action of Unhandled Rejection Error Handling
// Promise.reject(new Error('Unhandled rejection error')).then();





// Uncaught Exception Error Handling
process.on('uncaughtException', (error: unknown) => {

    if (error instanceof Error) {
        consolePrint('Uncaught Exception detected! Error: ', error.message)
    } else {
        consolePrint('Uncaught Exception detected! Error: ', error)
    }

    // Graceful shutdown.
    if (server) {
        consolePrint('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    } else {
        consolePrint('⚠️ Server closed gracefully!');
        process.exit(1);
    }
})
// Activate this code line to test the action of Uncaught Exception Error Handling
// throw new Error('Uncaught exception error');





// SIGTERM Signal Error Handling
process.on('SIGTERM', () => {
    consolePrint('SIGTERM Signal detected!')

    // Graceful shutdown.
    if (server) {
        consolePrint('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    } else {
        consolePrint('⚠️ Server closed gracefully!');
        process.exit(1);
    }
})
// This SIGTERM Signal can't be tested as it's not our hand






// SIGINT Signal Error Handling
process.on('SIGINT', (error: unknown) => {

    if (error instanceof Error) {
        consolePrint('SIGINT Signal detected! Error: ', error.message)
    } else {
        consolePrint('SIGINT Signal detected! Error: ', error)
    }

    // Graceful shutdown.
    if (server) {
        consolePrint('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    } else {
        consolePrint('⚠️ Server closed gracefully!');
        process.exit(1);
    }
})
// Run the server normally, and then close the server using [ Ctrl + C ], then this SIGINT will work
