"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const jwtRoleVerificationMiddleware_1 = __importDefault(require("../../middlewares/jwtRoleVerificationMiddleware"));
const user_interface_1 = require("../user/user.interface");
const passport_1 = __importDefault(require("passport"));
const zodValidationMiddleware_1 = __importDefault(require("../../middlewares/zodValidationMiddleware"));
const auth_zodValidation_1 = require("./auth.zodValidation");
const router = (0, express_1.Router)();
router.post("/login", 
// AuthControllers.loginWithCredentialsController,                  // Without passport package
auth_controller_1.AuthControllers.loginWithPassportCredentialsController);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessTokenController);
router.post("/logout", auth_controller_1.AuthControllers.logoutController);
router.post("/change-password", (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), auth_controller_1.AuthControllers.changePasswordController);
/*
TODO: Will implement these features
A route to 'reset-password' in case of forgot password
And a route to 'set-password' in case of users who previously registered with Google
And a route to get 'current-user-profile' in case of the currently logged in user
*/
router.post("/reset-password-request", (0, zodValidationMiddleware_1.default)(auth_zodValidation_1.resetPasswordRequestZodSchema), auth_controller_1.AuthControllers.resetPasswordRequestController);
router.post("/reset-password-finalization", (0, zodValidationMiddleware_1.default)(auth_zodValidation_1.resetPasswordFinalizationZodSchema), (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), auth_controller_1.AuthControllers.resetPasswordFinalizationController);
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectUrl = req.query.redirectUrl || "";
    passport_1.default.authenticate('google', { scope: ['email', 'profile'], state: redirectUrl })(req, res, next);
}));
// To Learn more, see the MyNotes/Workflow of passport-google-oauth20.pdf.
router.get("/google/callback", passport_1.default.authenticate('google', { failureRedirect: '/login' }), auth_controller_1.AuthControllers.googleCallbackController);
// To Learn more, see the MyNotes/Workflow of passport-google-oauth20.pdf.
exports.AuthRoutes = router;
