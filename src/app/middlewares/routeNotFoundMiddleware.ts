import {NextFunction, Request, Response} from "express";
import httpStatus from "http-status-codes";



const routeNotFoundMiddleware = (_req: Request, res: Response, _next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Route not found!',
    });
}



export default routeNotFoundMiddleware;
