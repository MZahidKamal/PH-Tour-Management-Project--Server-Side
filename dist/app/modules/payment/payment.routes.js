"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post("/success/", payment_controller_1.PaymentControllers.successPaymentController);
router.post("/fail", payment_controller_1.PaymentControllers.failPaymentController);
router.post("/cancel", payment_controller_1.PaymentControllers.cancelPaymentController);
router.post("/init-payment/:bookingId", payment_controller_1.PaymentControllers.initializePaymentForABookingController);
// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.
exports.PaymentRoutes = router;
