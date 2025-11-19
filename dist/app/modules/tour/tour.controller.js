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
exports.TourControllers = void 0;
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
const tour_service_1 = require("./tour.service");
const createATourTypeController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.createATourTypeService(req.body);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Tour type created successfully!",
        data: result
    });
}));
const getAllTourTypeController = (0, catchAsyncFunction_1.default)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.getAllTourTypesService();
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All tour types fetched successfully!",
        data: result
    });
}));
const updateATourTypeController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.updateATourTypeService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Tour type updated successfully!",
        data: result
    });
}));
const deleteATourTypeController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.deleteATourTypeService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Tour type deleted successfully!",
        data: result
    });
}));
const createATourController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.createATourService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Tour created successfully!",
        data: result
    });
}));
const getSingleTourController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.getSingleTourService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Single tour fetched successfully!",
        data: result
    });
}));
const getAllToursController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.getAllToursService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All tours fetched successfully!",
        data: result
    });
}));
const updateATourController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.updateATourService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Tour updated successfully!",
        data: result
    });
}));
const deleteATourController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.deleteATourService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Tour deleted successfully!",
        data: result
    });
}));
exports.TourControllers = {
    createATourTypeController,
    getAllTourTypeController,
    getSingleTourController,
    updateATourTypeController,
    deleteATourTypeController,
    createATourController,
    getAllToursController,
    updateATourController,
    deleteATourController
};
