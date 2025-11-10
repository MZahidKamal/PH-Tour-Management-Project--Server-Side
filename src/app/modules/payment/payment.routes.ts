import {Router} from "express";
import {PaymentControllers} from "./payment.controller";



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



router.post("/init-payment/:bookingId",
    PaymentControllers.initializePaymentForABookingController
);
// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.



export const PaymentRoutes = router;
