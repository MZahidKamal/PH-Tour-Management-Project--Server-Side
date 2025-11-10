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
exports.BookingControllers = void 0;
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_service_1 = require("./booking.service");
const createBookingController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.createBookingService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Booking created successfully!",
        data: result
    });
}));
const getAllBookingsController = (0, catchAsyncFunction_1.default)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.getAllBookingsService();
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Booking fetched successfully!",
        data: result
    });
}));
const getUserBookingsController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.getUserBookingsService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User Booking fetched successfully!",
        data: result
    });
}));
const getSingleBookingController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.getSingleBookingService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Single Booking fetched successfully!",
        data: result
    });
}));
const updateBookingStatusController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.updateBookingStatusService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Booking Status Updated Successfully!",
        data: result
    });
}));
exports.BookingControllers = {
    createBookingController,
    getAllBookingsController,
    getUserBookingsController,
    getSingleBookingController,
    updateBookingStatusController,
};
