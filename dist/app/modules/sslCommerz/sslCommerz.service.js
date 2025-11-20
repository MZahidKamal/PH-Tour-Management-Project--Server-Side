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
        (0, consolePrintFunction_1.consolePrint)(payload);
        // This is the response from SSLCOMMERZ after a successful payment.
        // There is a sample response given below for reference.
        const response = yield (0, axios_1.default)({
            method: 'GET',
            url: `${envConfig_1.default.sslcommerz_payment_validation_webservice_api}?val_id=${payload.val_id}&store_id=${envConfig_1.default.sslcommerz_store_id}&store_passwd=${envConfig_1.default.sslcommerz_store_password}`,
        });
        (0, consolePrintFunction_1.consolePrint)(response.data);
        // This is the response from SSLCOMMERZ after verifying the payment.
        // There is a sample response given below for reference.
        yield payment_model_1.PaymentModel.updateOne({ transactionId: payload.tran_id }, { $set: { paymentGatewayData: response.data } }, {
            // runValidators: true,
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
===== The response from SSLCOMMERZ after a successful payment =====

2025-11-20 02:46:48.499 [info] {
  amount: '13600.00',
  bank_tran_id: '25112084647Z8KDfxAO0C2zvDa',
  base_fair: '0.00',
  card_brand: 'VISA',
  card_issuer: 'EASTERN BANK, LTD.',
  card_issuer_country: 'Bangladesh',
  card_issuer_country_code: 'BD',
  card_no: '434977******9753',
  card_type: 'VISA-Dutch Bangla',
  currency: 'BDT',
  currency_amount: '13600.00',
  currency_rate: '1.0000',
  currency_type: 'BDT',
  risk_level: '0',
  risk_title: 'Safe',
  status: 'VALID',
  store_amount: '13260.00',
  store_id: 'phtou68b942aa7aef0',
  tran_date: '2025-11-20 08:46:01',
  tran_id: 'tran_1763606759349_718',
  val_id: '251120846470lv6H4IZKzXLeM3',
  value_a: 'N/A',
  value_b: 'N/A',
  value_c: 'N/A',
  value_d: 'N/A',
  verify_sign: '6ddbcb3aac6d5c2f4fe11556509861dd',
  verify_sign_sha2: '309bdb58e2d9c2f895ad5fc8862c06c2ee125ad727c34cb9987b1c1aac13d5cb',
  verify_key: 'amount,bank_tran_id,base_fair,card_brand,card_issuer,card_issuer_country,card_issuer_country_code,card_no,card_type,currency,currency_amount,currency_rate,currency_type,risk_level,risk_title,status,store_amount,store_id,tran_date,tran_id,val_id,value_a,value_b,value_c,value_d'
}




===== The response from SSLCOMMERZ after verifying the payment =====

2025-11-20 02:46:50.016 [info] {
  status: 'VALID',
  tran_date: '2025-11-20 08:46:01',
  tran_id: 'tran_1763606759349_718',
  val_id: '251120846470lv6H4IZKzXLeM3',
  amount: '13600.00',
  store_amount: '13260',
  currency: 'BDT',
  bank_tran_id: '25112084647Z8KDfxAO0C2zvDa',
  card_type: 'VISA-Dutch Bangla',
  card_no: '434977******9753',
  card_issuer: 'EASTERN BANK, LTD.',
  card_brand: 'VISA',
  card_category: 'CREDIT',
  card_sub_brand: '',
  card_issuer_country: 'Bangladesh',
  card_issuer_country_code: 'BD',
  currency_type: 'BDT',
  currency_amount: '13600.00',
  currency_rate: '1.0000',
  base_fair: '0.00',
  value_a: 'N/A',
  value_b: 'N/A',
  value_c: 'N/A',
  value_d: 'N/A',
  emi_instalment: '0',
  emi_amount: '0.00',
  emi_description: '',
  emi_issuer: 'EASTERN BANK, LTD.',
  account_details: '',
  risk_title: 'Safe',
  risk_level: '0',
  discount_percentage: '0',
  discount_amount: '0.00',
  discount_remarks: '',
  APIConnect: 'DONE',
  validated_on: '2025-11-20 08:46:49',
  gw_version: '',
  offer_avail: 1,
  card_ref_id: 'dc1da4f52669828139e81ef5eb0f48a5a99ea054a131e00a562887d455417dd908',
  isTokeizeSuccess: 0,
  campaign_code: ''
}
*/
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
