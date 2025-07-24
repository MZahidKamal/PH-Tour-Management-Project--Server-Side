import {Router} from "express";
import {UserControllers} from "./user.controller";



const router = Router();



router.post("/register", UserControllers.createUserController);
router.get("/all-users", UserControllers.getAllUsersController);



export const UserRoutes = router;
