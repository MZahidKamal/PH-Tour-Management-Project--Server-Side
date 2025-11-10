"use strict";
// User - Booking(Pending) -> Payment (Unpaid) -> SSLCommerz -> Booking update = confirm -> Payment update = Paid
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatusEnum = void 0;
var BookingStatusEnum;
(function (BookingStatusEnum) {
    BookingStatusEnum["PENDING"] = "PENDING";
    BookingStatusEnum["CANCELLED"] = "CANCELLED";
    BookingStatusEnum["COMPLETED"] = "COMPLETED";
    BookingStatusEnum["FAILED"] = "FAILED";
})(BookingStatusEnum || (exports.BookingStatusEnum = BookingStatusEnum = {}));
