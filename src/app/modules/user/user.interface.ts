import {Types} from "mongoose";





export enum IsActiveEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}





export enum RoleEnum {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE",
}





export interface AuthProviderInterface {
    provider: "google" | "credentials";
    providerId: string;
}





export interface UserInterface {
    name: string;
    email: string;
    password?: string;

    phone?: string;
    picture?: string;
    address?: string;

    role: RoleEnum;
    auths: AuthProviderInterface[];
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];

    isDeleted?: boolean;
    isActive?: IsActiveEnum;
    isVerified?: boolean;
}





/*
* Some warnings are coming from the IDE regarding the fields in the enums, saying these are unused and readonly.
* There are not from TypeScript, but from the IDE, so we can avoid these warnings.
*/
