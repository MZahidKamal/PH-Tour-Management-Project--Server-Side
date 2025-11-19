import UserModel from "../user/user.model";
import {RoleEnum} from "../user/user.interface";
import {TourModel, TourTypeModel} from "../tour/tour.model";
import DivisionModel from "../division/division.model";
import {BookingModel} from "../booking/booking.model";
import {PaymentModel} from "../payment/payment.model";





const dateToday = new Date();
const dateBeforeSevenDays = new Date(dateToday.getTime() - 7 * 24 * 60 * 60 * 1000);
const dateBeforeThirtyDays = new Date(dateToday.getTime() - 30 * 24 * 60 * 60 * 1000);

/* Alternative method to get today's date, last week's date and last month's date'
const dateToday = new Date();

const dateBeforeSevenDays = new Date(dateToday);
dateBeforeSevenDays.setDate(dateToday.getDate() - 7);

const dateBeforeThirtyDays = new Date(dateToday);
dateBeforeThirtyDays.setDate(dateToday.getDate() - 30);*/





const getBookingStatsService = async () => {

    // First we'll get total number of bookings from the database'
    const totalBookingsPromise = BookingModel.countDocuments({});

    // Then, we'll get all the bookings count, grouted by their status from the database'
    const bookingsCountGroupedByStatusPromise = BookingModel.aggregate([
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
    const bookingsCountGroupedByTourPromise = BookingModel.aggregate([
        {
            $lookup: {
                from: TourModel.collection.name,
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
    const averageGuestCountPerBookingPromise = BookingModel.aggregate([
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
    const bookingsCountInTodayPromise = BookingModel.countDocuments({
        createdAt: {
            $gte: dateToday,
        },
    });

    // Then, we'll get the number of bookings in last 7 days from the database'
    const bookingsCountInLastSevenDaysPromise = BookingModel.countDocuments({
        createdAt: {
            $gte: dateBeforeSevenDays,
        },
    });

    // Then we'll get the number of bookings in last 30 days from the database'
    const bookingsCountInLastThirtyDaysPromise = BookingModel.countDocuments({
        createdAt: {
            $gte: dateBeforeThirtyDays,
        },
    });

    // Then, we'll get the number of booking counts under each unique userss from the database'
    const bookingsCountGroupedByUserPromise = BookingModel.aggregate([
        {
            $lookup: {
                from: UserModel.collection.name,
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
    const [
        totalBookings,
        bookingsCountGroupedByStatus,
        bookingsCountGroupedByTour,
        averageGuestCountPerBooking,
        bookingsCountInToday,
        bookingsCountInLastSevenDays,
        bookingsCountInLastThirtyDays,
        bookingsCountGroupedByUser,
    ] = await Promise.all([
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
        averageGuestCountPerBooking: averageGuestCountPerBooking[0]?.averageGuestCount || 0,
        bookingsCountInToday,
        bookingsCountInLastSevenDays,
        bookingsCountInLastThirtyDays,
        bookingsCountGroupedByUser,
    };
};




const getPaymentStatsService = async () => {

    // First, we'll get the sum of all the payments from the database'
    const totalPaymentsPromise = PaymentModel.aggregate([
        {
            $group: {
                _id: null,
                totalPayments: { $sum: "$amount" },
            },
        },
    ]);

    // Then, we'll get the sum of all payments grouped by their status from the database'
    const paymentsCountGroupedByStatusPromise = PaymentModel.aggregate([
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
    const totalPaidPaymentsPromise = PaymentModel.aggregate([
        {
            $match: {
                status: "PAID"
            }
        },
        {
            $group: {
                _id: null,
                totalPaidPayments:
                    {
                        $sum: "$amount"
                    }
            }
        },
        {
            $project:
                {
                    _id: 0,
                    total_paid_payments: "$totalPaidPayments"
                }
        },
    ])

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
    const [
        totalPayments,
        paymentsCountGroupedByStatus,
        totalPaidPayments,
    ] = await Promise.all([
        totalPaymentsPromise,
        paymentsCountGroupedByStatusPromise,
        totalPaidPaymentsPromise,
    ]);

    // Finally we'll return an object containing all the payment statistics'
    return {
        totalPayments: totalPayments[0]?.totalPayments || 0,
        paymentsCountGroupedByStatus,
        paidPayments: totalPaidPayments[0]?.total_paid_payments || 0,
    };
};





const getUserStatsService = async () => {

    // First we'll get all the users from the database'
    const totalUsersPromise = UserModel.countDocuments({});

    // Then we'll get the total count of all the users who are active, inactive, blocked from the database'
    const totalActiveUsersPromise = UserModel.countDocuments({isActive: true});
    const totalInactiveUsersPromise = UserModel.countDocuments({isActive: false});
    const totalBlockedUsersPromise = UserModel.countDocuments({isBlocked: true});

    // Then we'll get the total count of all the users who are verified and unverified from the database'
    const totalVerifiedUsersPromise = UserModel.countDocuments({isVerified: true});
    const totalUnverifiedUsersPromise = UserModel.countDocuments({isVerified: false});

    // Then we'll get the total count of all the users who are admin, super admin and user from the database'
    const totalAdminUsersPromise = UserModel.countDocuments({role: RoleEnum.ADMIN});
    const totalSuperAdminUsersPromise = UserModel.countDocuments({role: RoleEnum.SUPER_ADMIN});
    const totalUserUsersPromise = UserModel.countDocuments({role: RoleEnum.USER});

    // Then we'll get the total count of all the users who joined today, last week and last month from the database'
    const totalUsersJoinedTodayPromise = await UserModel.countDocuments({createdAt: {$gte: dateToday}});
    const totalUsersJoinedLastWeekPromise = await UserModel.countDocuments({createdAt: {$gte: dateBeforeSevenDays}});
    const totalUsersJoinedLastMonthPromise = await UserModel.countDocuments({createdAt: {$gte: dateBeforeThirtyDays}});

    // Then we'll get the count of users grouped by their roles from the database'
    const usersCountGrouperByRolesPromise = UserModel.aggregate([
        {
            $group: {
                _id: "$role",
                count: {$sum: 1}
            }
        }
    ])

    // Then we'll await all the promises and get the results from the database in an array'
    const [
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
    ] = await Promise.all([
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
};





const getTourStatsService = async () => {

    // First, we'll get all the tours from the database'
    const totalToursPromise = TourModel.countDocuments({});

    // Then, we will get the total count of tours grouped by their types from the database'
    const toursCountGroupedByTypesPromise = TourModel.aggregate([
        {
            $lookup: {
                from: TourTypeModel.collection.name,
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
    ])

    // Then, we'll get total number of tours count grouped by their divisions from the database'
    const toursCountGroupedByDivisionsPromise = TourModel.aggregate([
        {
            $lookup: {
                from: DivisionModel.collection.name,
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
    const averageTourCostPromise = TourModel.aggregate([
        {
            $group: {
                _id: null,
                averageCost: {$avg: "$costFrom"}
            }
        },
        {
            $project: {
                _id: 0,
                averageCost: 1
            }
        }
    ])

    // Then, we'll get the tour, which have the highest number of bookings from the database'
    const highestBookedTourPromise = TourModel.aggregate([
        {
            $lookup: {
                localField: "_id",
                from: BookingModel.collection.name,
                foreignField: "tourId",
                as: "bookings",
            },
        },
        {
            $addFields: {
                bookingCount: {$size: "$bookings"},
            },
        },
        {
            $sort: {bookingCount: -1},
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
    const [
        totalTours,
        toursCountGroupedByTypes,
        toursCountGroupedByDivisions,
        averageTourCost,
        highestBookedTour,
    ] = await Promise.all([
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
};





export const StatServices = {
    getBookingStatsService,
    getPaymentStatsService,
    getUserStatsService,
    getTourStatsService
};
