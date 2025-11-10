"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = require("express");
const jwtRoleVerificationMiddleware_1 = __importDefault(require("../../middlewares/jwtRoleVerificationMiddleware"));
const user_interface_1 = require("../user/user.interface");
const booking_controller_1 = require("./booking.controller");
const zodValidationMiddleware_1 = __importDefault(require("../../middlewares/zodValidationMiddleware"));
const booking_zodValidation_1 = require("./booking.zodValidation");
const router = (0, express_1.Router)();
router.post("/", (0, zodValidationMiddleware_1.default)(booking_zodValidation_1.createBookingZodSchema), (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), booking_controller_1.BookingControllers.createBookingController);
router.get("/", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.ADMIN, user_interface_1.RoleEnum.SUPER_ADMIN), booking_controller_1.BookingControllers.getAllBookingsController);
router.get("/my-bookings", (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), booking_controller_1.BookingControllers.getUserBookingsController);
router.get("/:bookingId", (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), booking_controller_1.BookingControllers.getSingleBookingController);
router.patch("/:bookingId/status", (0, zodValidationMiddleware_1.default)(booking_zodValidation_1.updateBookingZodSchema), (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), booking_controller_1.BookingControllers.updateBookingStatusController);
exports.BookingRoutes = router;
