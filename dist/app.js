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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passportConfig");
const envConfig_1 = __importDefault(require("./app/config/envConfig"));
const app = (0, express_1.default)();
// Common Middlewares
app.use((0, cors_1.default)({
    origin: [envConfig_1.default.frontend_url],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Passport Middlewares (***the order is important)
app.use((0, express_session_1.default)({
    secret: envConfig_1.default.express_session_secret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
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
