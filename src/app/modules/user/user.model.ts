import {Schema, model} from "mongoose";
import {UserInterface} from "./user.interface";
import {IsActiveEnum, RoleEnum, AuthProviderInterface} from "./user.interface";





const authProviderSchema = new Schema<AuthProviderInterface>({
        provider: {
            type: String,
            required: true
        },
        providerId: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        _id: false
    })





const userSchema = new Schema<UserInterface>({
        name: {
            type: String,
            required: [true, "Name is required!"],
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            unique: [true, "Email already exists!"]
        },
        password: {
            type: String,
        },
        phone: {
            type: String
        },
        picture: {
            type: String
        },
        address: {
            type: String
        },
        role: {
            type: String,
            enum: Object.values(RoleEnum),
            default: RoleEnum.USER
        },
        auths: [authProviderSchema],
        bookings: {
            type: [Schema.Types.ObjectId],
            default: []
        },
        guides: {
            type: [Schema.Types.ObjectId],
            default: []
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: String,
            enum: Object.values(IsActiveEnum),
            default: IsActiveEnum.ACTIVE,
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    })





const UserModel = model<UserInterface>('User', userSchema);





export default UserModel;





// TODO: booking and guides in the userSchema is not fixed yet, so we'll redo it again.
