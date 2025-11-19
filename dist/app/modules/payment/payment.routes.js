"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const jwtRoleVerificationMiddleware_1 = __importDefault(require("../../middlewares/jwtRoleVerificationMiddleware"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/success/", payment_controller_1.PaymentControllers.successPaymentController);
router.post("/fail", payment_controller_1.PaymentControllers.failPaymentController);
router.post("/cancel", payment_controller_1.PaymentControllers.cancelPaymentController);
router.post("/verification/ipn_listener", payment_controller_1.PaymentControllers.paymentVerificationIPSListenerController);
router.post("/init-payment/:bookingId", (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), payment_controller_1.PaymentControllers.initializePaymentForABookingController);
router.get("/invoice/:paymentId", (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), payment_controller_1.PaymentControllers.getInvoiceDownloadUrlController);
// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.
exports.PaymentRoutes = router;
