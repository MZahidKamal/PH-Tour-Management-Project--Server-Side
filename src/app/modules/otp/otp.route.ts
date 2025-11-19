import {Router} from "express";
import {OTPControllers} from "./otp.controller";



const router = Router();



router.post("/send/",
    OTPControllers.SendOTPController
);



router.post("/verify/",
    OTPControllers.VerifyOTPController
);



// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.



export const OTPRoutes = router;
