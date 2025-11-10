import {Router} from "express";
import {UserControllers} from "./user.controller";
import {createUserZodSchema, updateUserZodSchema} from "./user.zodValidation";
import zodValidationMiddleware from "../../middlewares/zodValidationMiddleware";
import {RoleEnum} from "./user.interface";
import jwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";



const router = Router();



router.post("/register",
    zodValidationMiddleware(createUserZodSchema),
    UserControllers.createUserController
);



router.get("/all-users",
    jwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    UserControllers.getAllUsersController
);



router.patch("/:userId",
    zodValidationMiddleware(updateUserZodSchema),
    jwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    UserControllers.updateUserController
);
// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.



export const UserRoutes: Router = router;
