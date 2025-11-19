"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = __importDefault(require("./app/config/envConfig"));
const app_1 = __importDefault(require("./app"));
const seedSuperAdminFunction_1 = __importDefault(require("./app/utils/seedSuperAdminFunction"));
const consolePrintFunction_1 = require("./app/utils/consolePrintFunction");
const redis_config_1 = require("./app/config/redis.config");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connecting to MongoDB, using the Mongoose package.
        const database = yield mongoose_1.default.connect(envConfig_1.default.mongodb_uri);
        if (database)
            (0, consolePrintFunction_1.consolePrint)('✅ Connected to MongoDB successfully!');
        else
            (0, consolePrintFunction_1.consolePrint)('❌ Failed to connect to MongoDB!');
        // Starting the server to see the output in the browser.
        server = app_1.default.listen(envConfig_1.default.port, () => {
            (0, consolePrintFunction_1.consolePrint)(`✅ PH Tour Management Project - Server Side, is listening on port ${envConfig_1.default.port}`);
        });
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedisDatabase)();
    yield startServer();
    yield (0, seedSuperAdminFunction_1.default)();
}))();
/* This is an IIFE (Immediately Invoked Function Expression) function to run the startServer function immediately
and then run the seedSuperAdminFunction function immediately.
Only after the server is completely started, the `seedSuperAdminFunction` is called.
This is important because you want to make sure the server (and thus the database connection) is fully established
before trying to create the super admin user, as the `seedSuperAdminFunction` requires a database connection to work
with the `UserModel`. */
// Unhandled Rejection Error Handling
process.on('unhandledRejection', (error) => {
    if (error instanceof Error) {
        (0, consolePrintFunction_1.consolePrint)('Unhandled Rejection detected! Error: ', error.message);
    }
    else {
        (0, consolePrintFunction_1.consolePrint)('Unhandled Rejection detected! Error: ', error);
    }
    // Graceful shutdown.
    if (server) {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    }
    else {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        process.exit(1);
    }
});
// Activate this code line to test the action of Unhandled Rejection Error Handling
// Promise.reject(new Error('Unhandled rejection error')).then();
// Uncaught Exception Error Handling
process.on('uncaughtException', (error) => {
    if (error instanceof Error) {
        (0, consolePrintFunction_1.consolePrint)('Uncaught Exception detected! Error: ', error.message);
    }
    else {
        (0, consolePrintFunction_1.consolePrint)('Uncaught Exception detected! Error: ', error);
    }
    // Graceful shutdown.
    if (server) {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    }
    else {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        process.exit(1);
    }
});
// Activate this code line to test the action of Uncaught Exception Error Handling
// throw new Error('Uncaught exception error');
// SIGTERM Signal Error Handling
process.on('SIGTERM', () => {
    (0, consolePrintFunction_1.consolePrint)('SIGTERM Signal detected!');
    // Graceful shutdown.
    if (server) {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    }
    else {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        process.exit(1);
    }
});
// This SIGTERM Signal can't be tested as it's not our hand
// SIGINT Signal Error Handling
process.on('SIGINT', (error) => {
    if (error instanceof Error) {
        (0, consolePrintFunction_1.consolePrint)('SIGINT Signal detected! Error: ', error.message);
    }
    else {
        (0, consolePrintFunction_1.consolePrint)('SIGINT Signal detected! Error: ', error);
    }
    // Graceful shutdown.
    if (server) {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        server.close(() => process.exit(1));
    }
    else {
        (0, consolePrintFunction_1.consolePrint)('⚠️ Server closed gracefully!');
        process.exit(1);
    }
});
// Run the server normally, and then close the server using [ Ctrl + C ], then this SIGINT will work
