import {AuthProviderInterface, IsActiveEnum, RoleEnum, UserInterface} from "./user.interface";
import UserModel from "./user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import envConfig from "../../config/envConfig";
import {JwtPayload} from "jsonwebtoken";





const createUserService = async (payload: Partial<UserInterface>) => {

    // Destructuring the payload
    const {email, password, ...rest} = payload;

    // Check if email already exists
    const isEmailExist = await UserModel.findOne({email});
    if (isEmailExist) {
        throw new AppError(httpStatus.CONFLICT, "Email already exists!");
    }

    // If the email does not exist, then hash the password
    const hashedPassword = await bcrypt.hash(password as string, Number(envConfig.bcrypt_salt_rounds as string));

    // Then set up the auth provider, how the user is being authenticated
    const authProvider: AuthProviderInterface = {provider: 'credentials', providerId : email as string};

    // Now finally create the user
    const newUser = await UserModel.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });

    // The newUser is a mongoose document, so we need to convert it to a plain JavaScript object.
    // And then remove the password from the object
    // And then we'll return only the newUserObject without the password field
    const newUserObject = newUser.toObject();
    delete newUserObject.password;

    // Finally we'll return the newUserObject
    return newUserObject;
}





const getAllUsersService = async () => {

    // Find all users from the database
    const users = await UserModel.find({});

    // Then return the users
    return users;
}





const updateUserService = async (userId: string, payload: Partial<UserInterface>, decodedToken: JwtPayload) => {

    /* These are the rules:-------------------------------------------------------------------
    * email can't be updated
    * name, phone, password and address can be updated
    * password needs to be rehashed before updating
    * the role, isDeleted, isActive and isVerified can only be updated by admin or super admin
    * promoting to admin or super admin can only be done by super admin
    * */

    if (payload.role){
        if (decodedToken.role === RoleEnum.USER || decodedToken.role === RoleEnum.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update the role field!");
        }
        if (decodedToken.role === RoleEnum.ADMIN && payload.role === RoleEnum.SUPER_ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to promote a user to super admin!");
        }
    }

    if (payload.isDeleted || payload.isActive || payload.isVerified) {
        if (decodedToken.role === RoleEnum.USER || decodedToken.role === RoleEnum.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update these fields!");
        }
    }

    if (payload.password) {
        const hashedPassword = await bcrypt.hash(payload.password as string, Number(envConfig.bcrypt_salt_rounds as string));
        payload.password = hashedPassword;
    }

    const isUserExists = await UserModel.findById(userId);
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (
        isUserExists.isDeleted === true
        || isUserExists.isActive === IsActiveEnum.INACTIVE
        || isUserExists.isActive === IsActiveEnum.BLOCKED
    ){
        throw new AppError(httpStatus.FORBIDDEN, "The user is deleted, inactive or blocked!");
    }

    const updatedUserDocument = await UserModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

    return updatedUserDocument;
}





// Named exports
export const UserServices = {
    createUserService,
    getAllUsersService,
    updateUserService
}
