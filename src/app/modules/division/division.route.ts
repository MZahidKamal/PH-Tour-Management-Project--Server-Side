import {Router} from "express";
import zodValidationMiddleware from "../../middlewares/zodValidationMiddleware";
import {createADivisionValidationZodSchema, updateADivisionValidationZodSchema} from "./division.zodValidation";
import {DivisionControllers} from "./division.controller";
import JwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";
import {multerUpload} from "../../config/multer.config";
import parseMultipartJsonMiddleware from "../../middlewares/parseMultipartJsonMiddleware";





const router = Router();





router.post("/create",
    JwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    multerUpload.single("file"),
    parseMultipartJsonMiddleware,
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
    multerUpload.single("file"),
    parseMultipartJsonMiddleware,
    zodValidationMiddleware(updateADivisionValidationZodSchema),
    DivisionControllers.updateADivisionController
);



router.delete("/:divisionId",
    JwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    DivisionControllers.deleteADivisionController
);





export const DivisionRoutes = router;
