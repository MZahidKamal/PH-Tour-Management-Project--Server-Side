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
exports.DivisionControllers = void 0;
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const division_service_1 = require("./division.service");
const createADivisionController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await DivisionServices.createADivisionService(req.body);
    // Before using multer+multer-storage-cloudinary, we had to use req.body to get the division object.
    // Now because we are using multer+multer-storage-cloudinary, we can use req.body.data to get the division object.
    // And req.file to get the image file object.
    // Therefore...
    const result = yield division_service_1.DivisionServices.createADivisionService(req);
    // consolePrint(req.body.data)
    // consolePrint(req.file)
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Division created successfully!",
        data: result
    });
}));
const getAllDivisionsController = (0, catchAsyncFunction_1.default)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.DivisionServices.getAllDivisionsService();
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All divisions fetched successfully!",
        data: result
    });
}));
const getSingleDivisionController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.DivisionServices.getSingleDivisionService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Single division fetched successfully!",
        data: result
    });
}));
const updateADivisionController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.DivisionServices.updateADivisionService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Division updated successfully!",
        data: result
    });
}));
const deleteADivisionController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.DivisionServices.deleteADivisionService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Division deleted successfully!",
        data: result
    });
}));
exports.DivisionControllers = {
    createADivisionController,
    getAllDivisionsController,
    getSingleDivisionController,
    updateADivisionController,
    deleteADivisionController,
};
