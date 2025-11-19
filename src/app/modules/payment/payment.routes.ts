import {Router} from "express";
import {PaymentControllers} from "./payment.controller";
import jwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";



const router = Router();



router.post("/success/",
    PaymentControllers.successPaymentController
);



router.post("/fail",
    PaymentControllers.failPaymentController
);



router.post("/cancel",
    PaymentControllers.cancelPaymentController
);



router.post("/verification/ipn_listener",
    PaymentControllers.paymentVerificationIPSListenerController
);



router.post("/init-payment/:bookingId",
    jwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    PaymentControllers.initializePaymentForABookingController
);



router.get("/invoice/:paymentId",
    jwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    PaymentControllers.getInvoiceDownloadUrlController
);
// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.



export const PaymentRoutes = router;
