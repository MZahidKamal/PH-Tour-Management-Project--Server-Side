import {JwtPayload, SignOptions} from "jsonwebtoken";
import envConfig from "../config/envConfig";
import jwt from "jsonwebtoken";



const generateJWTTokenFunction = (jwtPayload: JwtPayload) => {

    const jwtSecret = envConfig.jwt_secret as string;
    const jwtExpiration = envConfig.jwt_expires_in as string;

    const jwtToken: string = jwt.sign(jwtPayload as JwtPayload, jwtSecret as string, {expiresIn: jwtExpiration} as SignOptions);

    return jwtToken;
}



export default generateJWTTokenFunction;
