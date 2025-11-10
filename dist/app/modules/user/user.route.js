"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_zodValidation_1 = require("./user.zodValidation");
const zodValidationMiddleware_1 = __importDefault(require("../../middlewares/zodValidationMiddleware"));
const user_interface_1 = require("./user.interface");
const jwtRoleVerificationMiddleware_1 = __importDefault(require("../../middlewares/jwtRoleVerificationMiddleware"));
const router = (0, express_1.Router)();
router.post("/register", (0, zodValidationMiddleware_1.default)(user_zodValidation_1.createUserZodSchema), user_controller_1.UserControllers.createUserController);
router.get("/all-users", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.ADMIN, user_interface_1.RoleEnum.SUPER_ADMIN), user_controller_1.UserControllers.getAllUsersController);
router.patch("/:userId", (0, zodValidationMiddleware_1.default)(user_zodValidation_1.updateUserZodSchema), (0, jwtRoleVerificationMiddleware_1.default)(...Object.values(user_interface_1.RoleEnum)), user_controller_1.UserControllers.updateUserController);
// These types of routes, where : is used, are called parameterized routes.
// These parameterized routes need to be positioned after the non-parameterized routes.
exports.UserRoutes = router;
