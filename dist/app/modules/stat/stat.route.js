"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatRoutes = void 0;
const express_1 = require("express");
const jwtRoleVerificationMiddleware_1 = __importDefault(require("../../middlewares/jwtRoleVerificationMiddleware"));
const user_interface_1 = require("../user/user.interface");
const stat_controller_1 = require("./stat.controller");
const router = (0, express_1.Router)();
router.get("/booking", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.ADMIN, user_interface_1.RoleEnum.SUPER_ADMIN), stat_controller_1.StatControllers.getBookingStatsController);
router.get("/payment", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.ADMIN, user_interface_1.RoleEnum.SUPER_ADMIN), stat_controller_1.StatControllers.getPaymentStatsController);
router.get("/user", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.ADMIN, user_interface_1.RoleEnum.SUPER_ADMIN), stat_controller_1.StatControllers.getUserStatsController);
router.get("/tour", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.ADMIN, user_interface_1.RoleEnum.SUPER_ADMIN), stat_controller_1.StatControllers.getTourStatsController);
exports.StatRoutes = router;
