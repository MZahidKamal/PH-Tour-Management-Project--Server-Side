import express, {Application, Request, Response} from 'express';
import cors from "cors";
import httpStatus from "http-status-codes";
import router from "./app/routes/routesIndex";
import globalErrorHandlerMiddleware from "./app/middlewares/globalErrorHandlerMiddleware";
import routeNotFoundMiddleware from "./app/middlewares/routeNotFoundMiddleware";



const app: Application = express();



// Common Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



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
