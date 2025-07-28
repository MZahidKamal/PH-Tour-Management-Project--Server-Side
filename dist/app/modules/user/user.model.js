"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new mongoose_1.Schema({
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
        enum: Object.values(user_interface_1.RoleEnum),
        default: user_interface_1.RoleEnum.USER
    },
    auths: [authProviderSchema],
    bookings: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: []
    },
    guides: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActiveEnum),
        default: user_interface_1.IsActiveEnum.ACTIVE,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
// TODO: booking and guides in the userSchema is not fixed yet, so we'll redo it again.
