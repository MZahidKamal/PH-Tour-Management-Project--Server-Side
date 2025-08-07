import {Request, Response, NextFunction, Router} from "express";
import {AuthControllers} from "./auth.controller";
import JwtRoleVerificationMiddleware from "../../middlewares/jwtRoleVerificationMiddleware";
import {RoleEnum} from "../user/user.interface";
import passport from "passport";



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



router.post("/reset-password",
    JwtRoleVerificationMiddleware(...Object.values(RoleEnum)),
    AuthControllers.resetPasswordController
);



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
