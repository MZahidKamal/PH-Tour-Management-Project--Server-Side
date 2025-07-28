import {ZodObject} from "zod";
import {NextFunction, Request, Response} from "express";



const zodValidationMiddleware = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {


    try {

        // console.log('Pre Validated Request: ', req.body);

        // First, check if user-creating inputs are valid, according to the Zod schema, or not

        req.body = await zodSchema.parseAsync(req.body);

        // console.log('Post Validated Request: ', req.body);

        // If the inputs are valid, then pass the request to the next middleware
        next();

    }
    catch (error) {
        console.log(error);
        next(error);
    }



}



export default zodValidationMiddleware;
