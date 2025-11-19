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
exports.StatServices = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const user_interface_1 = require("../user/user.interface");
const tour_model_1 = require("../tour/tour.model");
const division_model_1 = __importDefault(require("../division/division.model"));
const booking_model_1 = require("../booking/booking.model");
const payment_model_1 = require("../payment/payment.model");
const dateToday = new Date();
const dateBeforeSevenDays = new Date(dateToday.getTime() - 7 * 24 * 60 * 60 * 1000);
const dateBeforeThirtyDays = new Date(dateToday.getTime() - 30 * 24 * 60 * 60 * 1000);
/* Alternative method to get today's date, last week's date and last month's date'
const dateToday = new Date();

const dateBeforeSevenDays = new Date(dateToday);
dateBeforeSevenDays.setDate(dateToday.getDate() - 7);

const dateBeforeThirtyDays = new Date(dateToday);
dateBeforeThirtyDays.setDate(dateToday.getDate() - 30);*/
const getBookingStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // First we'll get total number of bookings from the database'
    const totalBookingsPromise = booking_model_1.BookingModel.countDocuments({});
    // Then, we'll get all the bookings count, grouted by their status from the database'
    const bookingsCountGroupedByStatusPromise = booking_model_1.BookingModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                booking_status: "$_id",
                total_booking_count: "$count",
            },
        },
    ]);
    // Then, we'll get the total number of bookings in each tour title from the database'
    const bookingsCountGroupedByTourPromise = booking_model_1.BookingModel.aggregate([
        {
            $lookup: {
                from: tour_model_1.TourModel.collection.name,
                localField: "tourId",
                foreignField: "_id",
                as: "tourInfo",
            },
        },
        { $unwind: "$tourInfo" },
        {
            $group: {
                _id: "$tourInfo.title",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                tour_title: "$_id",
                total_booking_count: "$count",
            },
        },
        // optional: { $sort: { total_booking_count: -1 } }
    ]);
    // Then, we'll calculate the average guest count per booking from the database'
    const averageGuestCountPerBookingPromise = booking_model_1.BookingModel.aggregate([
        {
            $group: {
                _id: null,
                averageGuestCount: {
                    $avg: "$guestCount"
                },
            },
        },
        {
            $project: {
                _id: 0,
                averageGuestCount: {
                    $ifNull: [
                        "$averageGuestCount", 0
                    ]
                },
            },
        },
    ]);
    // Then, we'll get the number of bookings in today from the database'
    const bookingsCountInTodayPromise = booking_model_1.BookingModel.countDocuments({
        createdAt: {
            $gte: dateToday,
        },
    });
    // Then, we'll get the number of bookings in last 7 days from the database'
    const bookingsCountInLastSevenDaysPromise = booking_model_1.BookingModel.countDocuments({
        createdAt: {
            $gte: dateBeforeSevenDays,
        },
    });
    // Then we'll get the number of bookings in last 30 days from the database'
    const bookingsCountInLastThirtyDaysPromise = booking_model_1.BookingModel.countDocuments({
        createdAt: {
            $gte: dateBeforeThirtyDays,
        },
    });
    // Then, we'll get the number of booking counts under each unique userss from the database'
    const bookingsCountGroupedByUserPromise = booking_model_1.BookingModel.aggregate([
        {
            $lookup: {
                from: user_model_1.default.collection.name,
                localField: "userId",
                foreignField: "_id",
                as: "userInfo",
            },
        },
        {
            $unwind: "$userInfo",
        },
        {
            $group: {
                _id: {
                    userId: "$userInfo._id",
                    userName: "$userInfo.name",
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                user_id: "$_id.userId",
                user_name: "$_id.userName",
                total_booking_count: "$count",
            },
        },
    ]);
    // Then we'll await all the promises and get the results from the database in an array'
    const [totalBookings, bookingsCountGroupedByStatus, bookingsCountGroupedByTour, averageGuestCountPerBooking, bookingsCountInToday, bookingsCountInLastSevenDays, bookingsCountInLastThirtyDays, bookingsCountGroupedByUser,] = yield Promise.all([
        totalBookingsPromise,
        bookingsCountGroupedByStatusPromise,
        bookingsCountGroupedByTourPromise,
        averageGuestCountPerBookingPromise,
        bookingsCountInTodayPromise,
        bookingsCountInLastSevenDaysPromise,
        bookingsCountInLastThirtyDaysPromise,
        bookingsCountGroupedByUserPromise,
    ]);
    // Finally we'll return an object containing all the booking statistics'
    return {
        totalBookings,
        bookingsCountGroupedByStatus,
        bookingsCountGroupedByTour,
        averageGuestCountPerBooking: ((_a = averageGuestCountPerBooking[0]) === null || _a === void 0 ? void 0 : _a.averageGuestCount) || 0,
        bookingsCountInToday,
        bookingsCountInLastSevenDays,
        bookingsCountInLastThirtyDays,
        bookingsCountGroupedByUser,
    };
});
const getPaymentStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // First, we'll get the sum of all the payments from the database'
    const totalPaymentsPromise = payment_model_1.PaymentModel.aggregate([
        {
            $group: {
                _id: null,
                totalPayments: { $sum: "$amount" },
            },
        },
    ]);
    // Then, we'll get the sum of all payments grouped by their status from the database'
    const paymentsCountGroupedByStatusPromise = payment_model_1.PaymentModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                payment_status: "$_id",
                total_payment_count: "$count",
            },
        },
    ]);
    // Then, we'll get the sum of all payments, where the status is 'PAID' from the database'
    const totalPaidPaymentsPromise = payment_model_1.PaymentModel.aggregate([
        {
            $match: {
                status: "PAID"
            }
        },
        {
            $group: {
                _id: null,
                totalPaidPayments: {
                    $sum: "$amount"
                }
            }
        },
        {
            $project: {
                _id: 0,
                total_paid_payments: "$totalPaidPayments"
            }
        },
    ]);
    // Then, we'll get the...
    /*const paymentGatewayDataPromise = PaymentModel.aggregate([
        {
            $group: {
                _id: {$ifNull: ["$paymentGatewayData.status", "UNKNOWN"]},
                count: {$sum: 1}
            },
        },
    ])*/
    // Then we'll await all the promises and get the results from the database in an array'
    const [totalPayments, paymentsCountGroupedByStatus, totalPaidPayments,] = yield Promise.all([
        totalPaymentsPromise,
        paymentsCountGroupedByStatusPromise,
        totalPaidPaymentsPromise,
    ]);
    // Finally we'll return an object containing all the payment statistics'
    return {
        totalPayments: ((_a = totalPayments[0]) === null || _a === void 0 ? void 0 : _a.totalPayments) || 0,
        paymentsCountGroupedByStatus,
        paidPayments: ((_b = totalPaidPayments[0]) === null || _b === void 0 ? void 0 : _b.total_paid_payments) || 0,
    };
});
const getUserStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    // First we'll get all the users from the database'
    const totalUsersPromise = user_model_1.default.countDocuments({});
    // Then we'll get the total count of all the users who are active, inactive, blocked from the database'
    const totalActiveUsersPromise = user_model_1.default.countDocuments({ isActive: true });
    const totalInactiveUsersPromise = user_model_1.default.countDocuments({ isActive: false });
    const totalBlockedUsersPromise = user_model_1.default.countDocuments({ isBlocked: true });
    // Then we'll get the total count of all the users who are verified and unverified from the database'
    const totalVerifiedUsersPromise = user_model_1.default.countDocuments({ isVerified: true });
    const totalUnverifiedUsersPromise = user_model_1.default.countDocuments({ isVerified: false });
    // Then we'll get the total count of all the users who are admin, super admin and user from the database'
    const totalAdminUsersPromise = user_model_1.default.countDocuments({ role: user_interface_1.RoleEnum.ADMIN });
    const totalSuperAdminUsersPromise = user_model_1.default.countDocuments({ role: user_interface_1.RoleEnum.SUPER_ADMIN });
    const totalUserUsersPromise = user_model_1.default.countDocuments({ role: user_interface_1.RoleEnum.USER });
    // Then we'll get the total count of all the users who joined today, last week and last month from the database'
    const totalUsersJoinedTodayPromise = yield user_model_1.default.countDocuments({ createdAt: { $gte: dateToday } });
    const totalUsersJoinedLastWeekPromise = yield user_model_1.default.countDocuments({ createdAt: { $gte: dateBeforeSevenDays } });
    const totalUsersJoinedLastMonthPromise = yield user_model_1.default.countDocuments({ createdAt: { $gte: dateBeforeThirtyDays } });
    // Then we'll get the count of users grouped by their roles from the database'
    const usersCountGrouperByRolesPromise = user_model_1.default.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    // Then we'll await all the promises and get the results from the database in an array'
    const [totalUsers, totalActiveUsers, totalInactiveUsers, totalBlockedUsers, totalVerifiedUsers, totalUnverifiedUsers, totalAdminUsers, totalSuperAdminUsers, totalUserUsers, totalUsersJoinedToday, totalUsersJoinedLastWeek, totalUsersJoinedLastMonth, usersCountGroupedByRoles] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInactiveUsersPromise,
        totalBlockedUsersPromise,
        totalVerifiedUsersPromise,
        totalUnverifiedUsersPromise,
        totalAdminUsersPromise,
        totalSuperAdminUsersPromise,
        totalUserUsersPromise,
        totalUsersJoinedTodayPromise,
        totalUsersJoinedLastWeekPromise,
        totalUsersJoinedLastMonthPromise,
        usersCountGrouperByRolesPromise
    ]);
    // Finally we'll return an object containing all the user statistics'
    return {
        totalUsers,
        totalActiveUsers,
        totalInactiveUsers,
        totalBlockedUsers,
        totalVerifiedUsers,
        totalUnverifiedUsers,
        totalAdminUsers,
        totalSuperAdminUsers,
        totalUserUsers,
        totalUsersJoinedToday,
        totalUsersJoinedLastWeek,
        totalUsersJoinedLastMonth,
        usersCountGroupedByRoles
    };
});
const getTourStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll get all the tours from the database'
    const totalToursPromise = tour_model_1.TourModel.countDocuments({});
    // Then, we will get the total count of tours grouped by their types from the database'
    const toursCountGroupedByTypesPromise = tour_model_1.TourModel.aggregate([
        {
            $lookup: {
                from: tour_model_1.TourTypeModel.collection.name,
                localField: "tourType",
                foreignField: "_id",
                as: "tourType"
            },
        },
        {
            $unwind: "$tourType"
        },
        {
            $group: {
                _id: "$tourType.name",
                count: {
                    $sum: 1
                }
            }
        }
    ]);
    // Then, we'll get total number of tours count grouped by their divisions from the database'
    const toursCountGroupedByDivisionsPromise = tour_model_1.TourModel.aggregate([
        {
            $lookup: {
                from: division_model_1.default.collection.name,
                localField: "division",
                foreignField: "_id",
                as: "divisionInfo",
            },
        },
        {
            $unwind: "$divisionInfo",
        },
        {
            $group: {
                _id: "$divisionInfo.name",
                count: { $sum: 1 },
            },
        },
    ]);
    // Then, we will get the average tour cost from the database'
    const averageTourCostPromise = tour_model_1.TourModel.aggregate([
        {
            $group: {
                _id: null,
                averageCost: { $avg: "$costFrom" }
            }
        },
        {
            $project: {
                _id: 0,
                averageCost: 1
            }
        }
    ]);
    // Then, we'll get the tour, which have the highest number of bookings from the database'
    const highestBookedTourPromise = tour_model_1.TourModel.aggregate([
        {
            $lookup: {
                localField: "_id",
                from: booking_model_1.BookingModel.collection.name,
                foreignField: "tourId",
                as: "bookings",
            },
        },
        {
            $addFields: {
                bookingCount: { $size: "$bookings" },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        {
            $limit: 1,
        },
        {
            $project: {
                _id: 0,
                title: 1,
                bookingCount: 1
            }
        },
    ]);
    // Then, we'll await all the promises and get the results from the database in an array'
    const [totalTours, toursCountGroupedByTypes, toursCountGroupedByDivisions, averageTourCost, highestBookedTour,] = yield Promise.all([
        totalToursPromise,
        toursCountGroupedByTypesPromise,
        toursCountGroupedByDivisionsPromise,
        averageTourCostPromise,
        highestBookedTourPromise,
    ]);
    // Finally we'll return an object containing all the tour statistics'
    return {
        totalTours,
        toursCountGroupedByTypes,
        toursCountGroupedByDivisions,
        averageTourCost,
        highestBookedTour,
    };
});
exports.StatServices = {
    getBookingStatsService,
    getPaymentStatsService,
    getUserStatsService,
    getTourStatsService
};
