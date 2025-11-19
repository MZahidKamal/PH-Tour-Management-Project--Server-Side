import {Router} from "express";
import jwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";
import {StatControllers} from "./stat.controller";



const router = Router();



router.get("/booking",
    jwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    StatControllers.getBookingStatsController,
);



router.get("/payment",
    jwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    StatControllers.getPaymentStatsController,
);



router.get("/user",
    jwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    StatControllers.getUserStatsController,
);



router.get("/tour",
    jwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    StatControllers.getTourStatsController,
);



export const StatRoutes = router;
