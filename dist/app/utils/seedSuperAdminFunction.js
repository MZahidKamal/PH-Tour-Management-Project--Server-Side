"use strict";
/* eslint-disable no-console */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const envConfig_1 = __importDefault(require("../config/envConfig"));
const user_interface_1 = require("../modules/user/user.interface");
const seedSuperAdminFunction = () => __awaiter(void 0, void 0, void 0, function* () {
    const isSuperAdminExists = yield user_model_1.default.findOne({ role: 'SUPER_ADMIN' });
    if (isSuperAdminExists) {
        console.log('Super admin already exists.');
        return;
    }
    if (!isSuperAdminExists) {
        const superAdmin = yield user_model_1.default.create({
            name: envConfig_1.default.super_admin_name,
            email: envConfig_1.default.super_admin_email,
            password: yield bcryptjs_1.default.hash(envConfig_1.default.super_admin_password, Number(envConfig_1.default.bcrypt_salt_rounds)),
            role: user_interface_1.RoleEnum.SUPER_ADMIN,
            auths: [{ provider: 'credentials', providerId: envConfig_1.default.super_admin_email }],
        });
        const { name, email, role } = superAdmin;
        console.log('New Super Admin created successfully:', { name, email, role });
        return;
    }
});
exports.default = seedSuperAdminFunction;
