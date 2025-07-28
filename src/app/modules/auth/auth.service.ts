import {UserInterface} from "../user/user.interface";
import UserModel from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import generateJWTTokenFunction from "../../utils/generateJWTTokenFunction";





const loginWithCredentialsService = async (payload: Partial<UserInterface>) => {

    // Destructuring the payload
    const {email, password} = payload;

    // Checking the user with the provided email exists in the database
    const userFromDatabase = await UserModel.findOne({email});
    if (!userFromDatabase) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // If the user is found, then check if the password provided is correct
    const isPasswordValid = await bcrypt.compare(password as string, userFromDatabase.password as string);
    if (!isPasswordValid) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password!");
    }

    // If the password is correct, then create a JWT token using some information about the user, ***not all of them***
    const jwtPayload = {
        userId: userFromDatabase._id,
        email: userFromDatabase.email,
        role: userFromDatabase.role,
    };
    const jwtToken: string = generateJWTTokenFunction(jwtPayload);

    // after creating the JWT token, return some information about the user along with the JWT token
    const {email: userEmail, role, ...rest} = userFromDatabase;
    return {
        email: userEmail,
        role,
        accessToken: jwtToken
    };
}





// Named exports
export const AuthServices = {
    loginWithCredentialsService
}
