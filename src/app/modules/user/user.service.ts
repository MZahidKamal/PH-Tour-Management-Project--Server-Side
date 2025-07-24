import {UserInterface} from "./user.interface";
import User from "./user.model";


const createUserService = async (payload: Partial<UserInterface>) => {
    const {name, email} = payload;
    const newUser = await User.create({name, email});
    return newUser;
}


const getAllUsersService = async () => {
    const users = await User.find({});
    return users;
}


// Named exports
export const UserServices = {
    createUserService,
    getAllUsersService
}
