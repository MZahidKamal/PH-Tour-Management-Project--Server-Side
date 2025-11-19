"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPRoutes = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const router = (0, express_1.Router)();
router.post("/send/", otp_controller_1.OTPControllers.SendOTPController);
router.post("/verify/", otp_controller_1.OTPControllers.VerifyOTPController);
// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.
exports.OTPRoutes = router;
