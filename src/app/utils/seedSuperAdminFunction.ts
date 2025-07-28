import UserModel from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import envConfig from "../config/envConfig";
import {RoleEnum, UserInterface} from "../modules/user/user.interface";



const seedSuperAdminFunction = async () => {

    const isSuperAdminExists = await UserModel.findOne({ role: 'SUPER_ADMIN' });

    if (isSuperAdminExists) {
        console.log('Super admin already exists.');
        return;
    }

    if (!isSuperAdminExists) {
        const superAdmin: UserInterface = await UserModel.create({
            name: envConfig.super_admin_name as string,
            email: envConfig.super_admin_email as string,
            password: await bcrypt.hash(envConfig.super_admin_password as string, Number(envConfig.bcrypt_salt_rounds)),
            role: RoleEnum.SUPER_ADMIN,
            auths: [{ provider: 'credentials', providerId: envConfig.super_admin_email as string }],
        });
        const {name, email, role} = superAdmin;
        console.log('New Super Admin created successfully:', {name, email, role});
        return;
    }
};



export default seedSuperAdminFunction;
