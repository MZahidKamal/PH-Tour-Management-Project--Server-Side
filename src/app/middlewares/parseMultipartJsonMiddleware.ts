import { Request, Response, NextFunction } from "express";
import {consolePrint} from "../utils/consolePrintFunction";



const parseMultipartJsonMiddleware = (req: Request, _res: Response, next: NextFunction) => {

    // If there's a 'data' field in body (from multipart/form-data), parse it
    if (req.body.data && typeof req.body.data === 'string') {
        try {
            req.body = JSON.parse(req.body.data);
        }
        catch (error) {
            // If parsing fails, leave it as is
            // console.error('Failed to parse multipart JSON data:', error);
            consolePrint('Failed to parse multipart JSON data:', error);
        }
    }
    next();
};



export default parseMultipartJsonMiddleware;
