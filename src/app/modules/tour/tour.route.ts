import {Router} from "express";
import JwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";
import zodValidationMiddleware from "../../middlewares/zodValidationMiddleware";
import {
    createATourTypeValidationZodSchema,
    createATourValidationZodSchema,
    updateATourTypeValidationZodSchema, updateATourValidationZodSchema
} from "./tour.zodValidation";
import {TourControllers} from "./tour.controller";
import {multerUpload} from "../../config/multer.config";
import parseMultipartJsonMiddleware from "../../middlewares/parseMultipartJsonMiddleware";





const router = Router();





/*============ Tour Type Routes ============*/
router.get("/tour-types",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    TourControllers.getAllTourTypeController
);

router.post("/create-tour-type",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    zodValidationMiddleware(createATourTypeValidationZodSchema),
    TourControllers.createATourTypeController
);

router.patch("/tour-types/:tourTypeId",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    zodValidationMiddleware(updateATourTypeValidationZodSchema),
    TourControllers.updateATourTypeController
);

router.delete("/tour-types/:tourTypeId",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    TourControllers.deleteATourTypeController
);






/*============== Tour Routes ==============*/
router.get("/",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    TourControllers.getAllToursController
);

router.get("/:slug",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    TourControllers.getSingleTourController
);

router.post("/create",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    multerUpload.array("files", 3),
    parseMultipartJsonMiddleware,
    zodValidationMiddleware(createATourValidationZodSchema),
    TourControllers.createATourController
);

router.patch("/:tourId",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    multerUpload.array("files", 3),
    parseMultipartJsonMiddleware,
    zodValidationMiddleware(updateATourValidationZodSchema),
    TourControllers.updateATourController
);

router.delete("/:tourId",
    JwtRoleVerificationMiddleware(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN),
    TourControllers.deleteATourController
);






export const TourRoutes = router;
