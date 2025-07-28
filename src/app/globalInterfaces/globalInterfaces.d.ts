import {JwtPayload} from "jsonwebtoken";


declare global {
    namespace Express {
        interface Request {
            userToken: JwtPayload;
        }
    }
}



/*
* This file is used to define the global interfaces for the Express framework in TypeScript.
* By default the Request interface does not have the userToken property.
* But for our project we need the userToken property in a place, from where we can access it throughout the project.
* So we are creating an extra property in the Request interface and declaring it in this file.
* */
