import {Router} from "express";
import jwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";
import {BookingControllers} from "./booking.controller";
import zodValidationMiddleware from "../../middlewares/zodValidationMiddleware";
import {createBookingZodSchema, updateBookingZodSchema} from "./booking.zodValidation";



const router = Router();


router.post("/",
    zodValidationMiddleware(createBookingZodSchema),
    jwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    BookingControllers.createBookingController
);



router.get("/",
    jwtRoleVerificationMiddleware(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN),
    BookingControllers.getAllBookingsController
);



router.get("/my-bookings",
    jwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    BookingControllers.getUserBookingsController
);



router.get("/:bookingId",
    jwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    BookingControllers.getSingleBookingController
);



router.patch("/:bookingId/status",
    zodValidationMiddleware(updateBookingZodSchema),
    jwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    BookingControllers.updateBookingStatusController
);



export const BookingRoutes = router;
