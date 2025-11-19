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
exports.SSLCommerzServices = void 0;
const envConfig_1 = __importDefault(require("../../config/envConfig"));
const axios_1 = __importDefault(require("axios"));
const consolePrintFunction_1 = require("../../utils/consolePrintFunction");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const payment_model_1 = require("../payment/payment.model");
const paymentInitiation = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const constructedPaymentDataObject = {
            /*Integration Required Parameters*/
            store_id: envConfig_1.default.sslcommerz_store_id,
            store_passwd: envConfig_1.default.sslcommerz_store_password,
            total_amount: payload.amount,
            currency: envConfig_1.default.sslcommerz_payment_currency,
            tran_id: payload.transactionId,
            success_url: `${envConfig_1.default.sslcommerz_backend_success_url_partial}?transactionId=${payload === null || payload === void 0 ? void 0 : payload.transactionId}&amount=${payload === null || payload === void 0 ? void 0 : payload.amount}&status=202&success=true&message=Payment%20completed%20successfully!`,
            fail_url: `${envConfig_1.default.sslcommerz_backend_fail_url_partial}?transactionId=${payload === null || payload === void 0 ? void 0 : payload.transactionId}&amount=${payload === null || payload === void 0 ? void 0 : payload.amount}&status=400&success=false&message=Payment%20failed!`,
            cancel_url: `${envConfig_1.default.sslcommerz_backend_cancel_url_partial}?transactionId=${payload === null || payload === void 0 ? void 0 : payload.transactionId}&amount=${payload === null || payload === void 0 ? void 0 : payload.amount}&status=400&success=false&message=Payment%20cancelled!`,
            product_category: 'Tour',
            ipn_url: envConfig_1.default.sslcommerz_ipn_url,
            /*Parameters to Handle EMI Transaction*/
            emi_option: 'N/A',
            emi_max_inst_option: 'N/A',
            emi_selected_inst: 'N/A',
            emi_allow_only: 'N/A',
            /*Customer Information*/
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: 'N/A',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: payload.phone,
            cus_fax: 'N/A',
            /*Shipment Information*/
            shipping_method: 'N/A',
            num_of_item: 'N/A',
            weight_of_items: 'N/A',
            logistic_pickup_id: 'N/A',
            logistic_delivery_type: 'N/A',
            ship_name: 'N/A',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_area: 'N/A',
            ship_city: 'N/A',
            ship_sub_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 'N/A',
            ship_country: 'N/A',
            /*Product Information*/
            product_name: 'N/A',
            // product_category : 'N/A',                // Given twice, therefore commented out.
            product_profile: 'N/A',
            hours_till_departure: 'N/A',
            flight_type: 'N/A',
            pnr: 'N/A',
            third_party_booking: 'N/A',
            length_of_stay: 'N/A',
            check_in_time: 'N/A',
            hotel_city: 'N/A',
            product_type: 'N/A',
            topup_number: 'N/A',
            country_topup: 'N/A',
            cart: 'N/A',
            product_amount: 'N/A',
            vat: 'N/A',
            discount_amount: 'N/A',
            convenience_fee: 'N/A',
            /*Customized or Additional Parameters*/
            value_a: 'N/A',
            value_b: 'N/A',
            value_c: 'N/A',
            value_d: 'N/A',
        };
        const response = yield (0, axios_1.default)({
            method: 'POST',
            url: envConfig_1.default.sslcommerz_payment_session_api,
            data: constructedPaymentDataObject,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        return response.data;
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)(error);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const paymentVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            method: 'GET',
            url: `${envConfig_1.default.sslcommerz_payment_validation_webservice_api}?val_id=${payload.val_id}&store_id=${envConfig_1.default.sslcommerz_store_id}&store_passwd=${envConfig_1.default.sslcommerz_store_password}`,
        });
        (0, consolePrintFunction_1.consolePrint)(response.data);
        yield payment_model_1.PaymentModel.updateOne({ transactionId: payload.transactionId }, { paymentGatewayData: response.data }, {
            runValidators: true,
            new: true
        });
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)(error);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Payment verification failed! ${error.message}`);
    }
});
exports.SSLCommerzServices = {
    paymentInitiation,
    paymentVerification
};
/*
Payment workflow with SSLCOMMERZ.


Frontend(localhost:5173)
- User- Tour
- Booking (Pending)
- Payment(Unpaid)
-> SSLCommerz Page
-> Payment Complete
-> Backend(localhost:5000/api/v1/payment/success)
-> Update Payment(PAID) & Booking(CONFIRM)
-> redirect to frontend
-> Frontend(localhost:5173/payment/success)


Frontend(localhost:5173)
- User
- Tour
- Booking (Pending)
- Payment(Unpaid)
-> SSLCommerz Page
-> Payment Fail / Cancel
-> Backend(localhost:5000)
-> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL)
-> redirect to frontend
-> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)


Visit SSLCOMMERZ development page [https://developer.sslcommerz.com/registration/] and create a Sandbox Store Account.
Website:            http://localhost:5173
Company Name:       PH Tour Management Project
Company Address:    60439 Frankfurt am Main
Name:               Alice Johnson
Email:              alice.johnson.testemail@gmail.com
Phone Number:       01767123456
Username:           alice_johnson
Password:           1234qweasy.#
Now check the email for the Sandbox Store details.


Merchant Panel URL: https://sandbox.sslcommerz.com/manage/
Login ID:   alice_johnson
Password:    1234qweasy.#
*/
