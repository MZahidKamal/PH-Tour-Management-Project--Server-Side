import express, {Application, Request, Response} from 'express';
import cors from "cors";
import httpStatus from "http-status-codes";
import router from "./app/routes/routesIndex";
import globalErrorHandlerMiddleware from "./app/middlewares/globalErrorHandlerMiddleware";
import routeNotFoundMiddleware from "./app/middlewares/routeNotFoundMiddleware";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passportConfig";
import envConfig from "./app/config/envConfig";



const app: Application = express();



// Common Middlewares
app.use(cors({
    origin: [envConfig.frontend_url as string],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json());
app.set('trust proxy', 1);
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



// Passport Middlewares (***the order is important)
app.use(expressSession({
    secret: envConfig.express_session_secret as string,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());




// Routes Forwarding Middlewares
app.use('/api/v1', router);



// Default root route handler
app.get('/', (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Welcome to PH Tour Management Project - Server Side',
    });
});



// Custom Middlewares (must be at the end of the middleware chain)
app.use(globalErrorHandlerMiddleware);
app.use(routeNotFoundMiddleware);



export default app;
