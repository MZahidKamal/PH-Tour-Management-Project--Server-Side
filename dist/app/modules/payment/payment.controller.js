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
exports.PaymentControllers = void 0;
const catchAsyncFunction_1 = __importDefault(require("../../utils/catchAsyncFunction"));
const payment_service_1 = require("./payment.service");
const envConfig_1 = __importDefault(require("../../config/envConfig"));
const sendResponseFunction_1 = __importDefault(require("../../utils/sendResponseFunction"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const successPaymentController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, amount, status, success, message } = req.query;
    const result = yield payment_service_1.PaymentServices.successPaymentService(req);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${envConfig_1.default.sslcommerz_frontend_success_url_partial}?transactionId=${transactionId}&amount=${amount}&status=${status}&success=${success}&message=${message}`);
    }
}));
const failPaymentController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, amount, status, success, message } = req.query;
    const result = yield payment_service_1.PaymentServices.failPaymentService(req);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${envConfig_1.default.sslcommerz_frontend_fail_url_partial}?transactionId=${transactionId}&amount=${amount}&status=${status}&success=${success}&message=${message}`);
    }
}));
const cancelPaymentController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, amount, status, success, message } = req.query;
    const result = yield payment_service_1.PaymentServices.cancelPaymentService(req);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${envConfig_1.default.sslcommerz_frontend_cancel_url_partial}?transactionId=${transactionId}&amount=${amount}&status=${status}&success=${success}&message=${message}`);
    }
}));
const paymentVerificationIPSListenerController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.paymentVerificationIPSListenerService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Payment verification successful!",
        data: result
    });
}));
const initializePaymentForABookingController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.initializePaymentForABookingService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Payment initiated successfully!",
        data: result
    });
}));
const getInvoiceDownloadUrlController = (0, catchAsyncFunction_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.getInvoiceDownloadUrlService(req);
    (0, sendResponseFunction_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Invoice download URL fetched successfully!",
        data: result
    });
}));
exports.PaymentControllers = {
    successPaymentController,
    failPaymentController,
    cancelPaymentController,
    paymentVerificationIPSListenerController,
    initializePaymentForABookingController,
    getInvoiceDownloadUrlController
};
