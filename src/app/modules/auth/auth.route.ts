import {Request, Response, NextFunction, Router} from "express";
import {AuthControllers} from "./auth.controller";
import JwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";
import passport from "passport";
import zodValidationMiddleware from "../../middlewares/zodValidationMiddleware";
import {resetPasswordFinalizationZodSchema, resetPasswordRequestZodSchema} from "./auth.zodValidation";



const router = Router();



router.post("/login",
    // AuthControllers.loginWithCredentialsController,                  // Without passport package
    AuthControllers.loginWithPassportCredentialsController,             // With passport package
);



router.post("/refresh-token",
    AuthControllers.getNewAccessTokenController
);



router.post("/logout",
    AuthControllers.logoutController
);



router.post("/change-password",
    JwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    AuthControllers.changePasswordController
);
/*
TODO: Will implement these features
A route to 'reset-password' in case of forgot password
And a route to 'set-password' in case of users who previously registered with Google
And a route to get 'current-user-profile' in case of the currently logged in user
*/



router.post("/reset-password-request",
    zodValidationMiddleware(resetPasswordRequestZodSchema),
    AuthControllers.resetPasswordRequestController
)



router.post("/reset-password-finalization",
    zodValidationMiddleware(resetPasswordFinalizationZodSchema),
    JwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    AuthControllers.resetPasswordFinalizationController
)



router.get("/google",
    async (req: Request, res: Response, next: NextFunction ) => {
        const redirectUrl = req.query.redirectUrl as string || "";
        passport.authenticate('google', { scope: ['email', 'profile'], state: redirectUrl })(req, res, next);
    }
)
// To Learn more, see the MyNotes/Workflow of passport-google-oauth20.pdf.



router.get("/google/callback",
    passport.authenticate('google', { failureRedirect: '/login' }),
    AuthControllers.googleCallbackController
);
// To Learn more, see the MyNotes/Workflow of passport-google-oauth20.pdf.



export const AuthRoutes = router;
