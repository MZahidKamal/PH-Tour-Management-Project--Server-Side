"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const routesIndex_1 = __importDefault(require("./app/routes/routesIndex"));
const globalErrorHandlerMiddleware_1 = __importDefault(require("./app/middlewares/globalErrorHandlerMiddleware"));
const routeNotFoundMiddleware_1 = __importDefault(require("./app/middlewares/routeNotFoundMiddleware"));
const app = (0, express_1.default)();
// Common Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes Forwarding Middlewares
app.use('/api/v1', routesIndex_1.default);
// Default root route handler
app.get('/', (req, res) => {
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: 'Welcome to PH Tour Management Project - Server Side',
    });
});
// Custom Middlewares (must be at the end of the middleware chain)
app.use(globalErrorHandlerMiddleware_1.default);
app.use(routeNotFoundMiddleware_1.default);
exports.default = app;
