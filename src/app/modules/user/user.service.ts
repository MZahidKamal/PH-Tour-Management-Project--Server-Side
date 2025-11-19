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





/* eslint-disable @typescript-eslint/no-explicit-any */
const getThisSingleUserService = async (payload: any) => {

    // First, we'll get the userId from the request parameters'
    const thisUserId = payload?.params?.thisUserId as string;

    const loggedInUserToken = payload.userToken as JwtPayload;
    const loggedInUserId = loggedInUserToken.userId as string;

    if (loggedInUserId !== thisUserId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to access this user's profile!");
    }

    // Then find the user from the database
    const thisUserFromDatabase = await UserModel.findById(thisUserId)
        .select('-password')
        .lean();
    if (!thisUserFromDatabase) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (loggedInUserToken.role !== thisUserFromDatabase.role) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to access this user's profile!");
    }

    // Then return this user object
    return thisUserFromDatabase;
}





/* eslint-disable @typescript-eslint/no-explicit-any */
const getASingleUserService = async (payload: any) => {

    // First, we'll get the userId from the request parameters'
    const userId = payload?.params?.userId as string;

    // Then find the user from the database
    const userFromDatabase = await UserModel.findById(userId)
        .select('-password')
        .lean();
    if (!userFromDatabase) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // Then return the user object
    return userFromDatabase;
}





const updateUserService = async (userId: string, payload: Partial<UserInterface>, decodedToken: JwtPayload) => {

    /* These are the rules:-------------------------------------------------------------------
    * email can't be updated
    * name, phone, password and address can be updated
    * password needs to be rehashed before updating
    * the role, isDeleted, isActive and isVerified can only be updated by admin or super admin
    * promoting to admin or super admin can only be done by super admin
    * */

    if (decodedToken.role === RoleEnum.USER || decodedToken.role === RoleEnum.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this user!");
        }
    }

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

    /* Now we have separate api endpoints for updating password, so we don't need to do anything related to the password here.'
    if (payload.password) {
        const hashedPassword = await bcrypt.hash(payload.password as string, Number(envConfig.bcrypt_salt_rounds as string));
        payload.password = hashedPassword;
    }*/

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
    getThisSingleUserService,
    getASingleUserService,
    updateUserService
}
