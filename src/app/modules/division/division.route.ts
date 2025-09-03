import {Router} from "express";
import zodValidationMiddleware from "../../middlewares/zodValidationMiddleware";
import {createADivisionValidationZodSchema, updateADivisionValidationZodSchema} from "./division.zodValidation";
import {DivisionControllers} from "./division.controller";
import JwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";





const router = Router();





router.post("/create",
    JwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    zodValidationMiddleware(createADivisionValidationZodSchema),
    DivisionControllers.createADivisionController,
);



router.get("/",
    JwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    DivisionControllers.getAllDivisionsController,
);



router.get("/:slug",
    JwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    DivisionControllers.getSingleDivisionController,
);



router.patch("/:divisionId",
    JwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    zodValidationMiddleware(updateADivisionValidationZodSchema),
    DivisionControllers.updateADivisionController
);



router.delete("/:divisionId",
    JwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    DivisionControllers.deleteADivisionController
);





export const DivisionRoutes = router;
