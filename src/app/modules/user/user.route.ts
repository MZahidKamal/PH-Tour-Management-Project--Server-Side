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



export const UserRoutes: Router = router;
