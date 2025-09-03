"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRoutes = void 0;
const express_1 = require("express");
const jwtRoleVerificationMiddleware_1 = __importDefault(require("../../middlewares/jwtRoleVerificationMiddleware"));
const user_interface_1 = require("../user/user.interface");
const zodValidationMiddleware_1 = __importDefault(require("../../middlewares/zodValidationMiddleware"));
const tour_zodValidation_1 = require("./tour.zodValidation");
const tour_controller_1 = require("./tour.controller");
const router = (0, express_1.Router)();
/*============ Tour Type Routes ============*/
router.get("/tour-types", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), tour_controller_1.TourControllers.getAllTourTypeController);
router.post("/create-tour-type", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), (0, zodValidationMiddleware_1.default)(tour_zodValidation_1.createATourTypeValidationZodSchema), tour_controller_1.TourControllers.createATourTypeController);
router.patch("/tour-types/:tourTypeId", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), (0, zodValidationMiddleware_1.default)(tour_zodValidation_1.updateATourTypeValidationZodSchema), tour_controller_1.TourControllers.updateATourTypeController);
router.delete("/tour-types/:tourTypeId", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), tour_controller_1.TourControllers.deleteATourTypeController);
/*============== Tour Routes ==============*/
router.get("/", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), tour_controller_1.TourControllers.getAllToursController);
router.get("/:slug", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), tour_controller_1.TourControllers.getSingleTourController);
router.post("/create", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), (0, zodValidationMiddleware_1.default)(tour_zodValidation_1.createATourValidationZodSchema), tour_controller_1.TourControllers.createATourController);
router.patch("/:tourId", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), (0, zodValidationMiddleware_1.default)(tour_zodValidation_1.updateATourValidationZodSchema), tour_controller_1.TourControllers.updateATourController);
router.delete("/:tourId", (0, jwtRoleVerificationMiddleware_1.default)(user_interface_1.RoleEnum.SUPER_ADMIN, user_interface_1.RoleEnum.ADMIN), tour_controller_1.TourControllers.deleteATourController);
exports.TourRoutes = router;
