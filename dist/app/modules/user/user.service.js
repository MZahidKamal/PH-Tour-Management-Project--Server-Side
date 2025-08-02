"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_interface_1 = require("./user.interface");
const user_model_1 = __importDefault(require("./user.model"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const envConfig_1 = __importDefault(require("../../config/envConfig"));
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring the payload
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    // Check if email already exists
    const isEmailExist = yield user_model_1.default.findOne({ email });
    if (isEmailExist) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Email already exists!");
    }
    // If the email does not exist, then hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(envConfig_1.default.bcrypt_salt_rounds));
    // Then set up the auth provider, how the user is being authenticated
    const authProvider = { provider: 'credentials', providerId: email };
    // Now finally create the user
    const newUser = yield user_model_1.default.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    // The newUser is a mongoose document, so we need to convert it to a plain JavaScript object.
    // And then remove the password from the object
    // And then we'll return only the newUserObject without the password field
    const newUserObject = newUser.toObject();
    delete newUserObject.password;
    // Finally we'll return the newUserObject
    return newUserObject;
});
const getAllUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    // Find all users from the database
    const users = yield user_model_1.default.find({});
    // Then return the users
    return users;
});
const updateUserService = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    /* These are the rules:-------------------------------------------------------------------
    * email can't be updated
    * name, phone, password and address can be updated
    * password needs to be rehashed before updating
    * the role, isDeleted, isActive and isVerified can only be updated by admin or super admin
    * promoting to admin or super admin can only be done by super admin
    * */
    if (payload.role) {
        if (decodedToken.role === user_interface_1.RoleEnum.USER || decodedToken.role === user_interface_1.RoleEnum.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update the role field!");
        }
        if (decodedToken.role === user_interface_1.RoleEnum.ADMIN && payload.role === user_interface_1.RoleEnum.SUPER_ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to promote a user to super admin!");
        }
    }
    if (payload.isDeleted || payload.isActive || payload.isVerified) {
        if (decodedToken.role === user_interface_1.RoleEnum.USER || decodedToken.role === user_interface_1.RoleEnum.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update these fields!");
        }
    }
    if (payload.password) {
        const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(envConfig_1.default.bcrypt_salt_rounds));
        payload.password = hashedPassword;
    }
    const isUserExists = yield user_model_1.default.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    if (isUserExists.isDeleted === true
        || isUserExists.isActive === user_interface_1.IsActiveEnum.INACTIVE
        || isUserExists.isActive === user_interface_1.IsActiveEnum.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "The user is deleted, inactive or blocked!");
    }
    const updatedUserDocument = yield user_model_1.default.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return updatedUserDocument;
});
// Named exports
exports.UserServices = {
    createUserService,
    getAllUsersService,
    updateUserService
};
