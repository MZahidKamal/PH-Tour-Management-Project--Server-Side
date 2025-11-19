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
exports.TourService = void 0;
const consolePrintFunction_1 = require("../../utils/consolePrintFunction");
const tour_model_1 = require("./tour.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const QueryBuilderClass_1 = require("../../classes/QueryBuilderClass");
const cloudinary_config_1 = require("../../config/cloudinary.config");
/*============================== Tour Type Services ==============================*/
const createATourTypeService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll destructure the payload
    const { name: tourName } = payload;
    // Then, we'll check if we have this tour type already in the database
    const isTourTypeExist = yield tour_model_1.TourTypeModel.findOne({ name: tourName });
    if (isTourTypeExist !== null) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Tour type already exists!");
    }
    // If the tour type is not exist, then create a new tour type in the database
    const newTourType = yield tour_model_1.TourTypeModel.create(payload);
    // Finally, we'll return the newTourType
    return newTourType;
});
const getAllTourTypesService = () => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll get all the tour types from the database
    const allTourTypes = yield tour_model_1.TourTypeModel.find({});
    const totalTourTypesCount = yield tour_model_1.TourTypeModel.countDocuments({});
    // Then, we'll return the allTourTypes and the totalTourTypesCount
    return {
        data: allTourTypes,
        meta: {
            total: totalTourTypesCount
        }
    };
});
/* eslint-disable @typescript-eslint/no-explicit-any */
const updateATourTypeService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll destructure the payload
    const tourTypeId = payload.params.tourTypeId;
    const updatedTourType = payload.body;
    // Then we'll check if we really have this tour type id in the database
    const isTourTypeIdExists = yield tour_model_1.TourTypeModel.findById(tourTypeId);
    if (!isTourTypeIdExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type id not found!");
    }
    // Then we'll check if we have this tour type name already in the database
    const isNewTourTypeNameExists = yield tour_model_1.TourTypeModel.findOne({
        name: updatedTourType.name,
        _id: { $ne: tourTypeId }
    });
    if (isNewTourTypeNameExists) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Tour type name already exists!");
    }
    // Then we'll update the tour type in the database
    const updatedTourTypeObj = yield tour_model_1.TourTypeModel.findByIdAndUpdate(tourTypeId, updatedTourType, { new: true, runValidators: true });
    // Finally, we'll return the updatedTourTypeObj
    return updatedTourTypeObj;
});
/* eslint-disable @typescript-eslint/no-explicit-any */
const deleteATourTypeService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll extract the tour type id from the payload
    const tourTypeId = payload.params.tourTypeId;
    // Then we'll check if we really have this tour type id in the database
    const isTourTypeIdExists = yield tour_model_1.TourTypeModel.findById(tourTypeId);
    if (!isTourTypeIdExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type id not found!");
    }
    // Then we'll delete the tour type from the database
    yield tour_model_1.TourTypeModel.findByIdAndDelete(tourTypeId);
    const deletedTourType = yield tour_model_1.TourTypeModel.findById(tourTypeId);
    // Finally, we'll return the deleted tour type
    return deletedTourType;
});
/*============================== Tour Services ==============================*/
/* eslint-disable @typescript-eslint/no-explicit-any */
const createATourService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll extract the tour data from the payload.body and the tour images from the payload.files'
    const tourObj = payload.body;
    const tourImages = payload.files.map((file) => {
        return file.path;
    });
    // Then, we'll check if we have the tour title already in the database'
    const isTourTitleExist = yield tour_model_1.TourModel.findOne({ title: tourObj === null || tourObj === void 0 ? void 0 : tourObj.title });
    if (isTourTitleExist !== null) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Tour title already exists!");
    }
    // If the tour title is not exist, then create a new tour object for the database'
    const newTourObj = {
        title: tourObj === null || tourObj === void 0 ? void 0 : tourObj.title,
        slug: tourObj === null || tourObj === void 0 ? void 0 : tourObj.title.toLowerCase().split(' ').join('-').concat('-tour-in-' + (tourObj === null || tourObj === void 0 ? void 0 : tourObj.location.toLowerCase().split(' ').join('-'))),
        description: tourObj === null || tourObj === void 0 ? void 0 : tourObj.description,
        images: tourImages,
        location: tourObj === null || tourObj === void 0 ? void 0 : tourObj.location,
        costFrom: tourObj === null || tourObj === void 0 ? void 0 : tourObj.costFrom,
        departureLocation: tourObj === null || tourObj === void 0 ? void 0 : tourObj.departureLocation,
        arrivalLocation: tourObj === null || tourObj === void 0 ? void 0 : tourObj.arrivalLocation,
        startDate: tourObj === null || tourObj === void 0 ? void 0 : tourObj.startDate,
        endDate: tourObj === null || tourObj === void 0 ? void 0 : tourObj.endDate,
        included: tourObj === null || tourObj === void 0 ? void 0 : tourObj.included,
        excluded: tourObj === null || tourObj === void 0 ? void 0 : tourObj.excluded,
        amenities: tourObj === null || tourObj === void 0 ? void 0 : tourObj.amenities,
        tourPlan: tourObj === null || tourObj === void 0 ? void 0 : tourObj.tourPlan,
        maxGuests: tourObj === null || tourObj === void 0 ? void 0 : tourObj.maxGuests,
        minAge: tourObj === null || tourObj === void 0 ? void 0 : tourObj.minAge,
        division: tourObj === null || tourObj === void 0 ? void 0 : tourObj.division,
        tourType: tourObj === null || tourObj === void 0 ? void 0 : tourObj.tourType,
    };
    // Then we'll save the new tour object in the database'
    const newTour = yield tour_model_1.TourModel.create(newTourObj);
    // Finally we'll return the newTour
    return newTour;
});
/*const getAllToursService = async (payload: any) => {

    // Extracting the query parameters from the payload
    // const {location, searchTerm} = payload.query
    const location = payload.query.location ? payload.query.location : '';
    const searchTerm = payload.query.searchTerm ? payload.query.searchTerm : '';
    const sortTerm = payload.query.sort ? payload.query.sort : '-createdAt';
    const fields = payload.query.fields ? payload.query.fields : '';
    const limit = Number(payload.query.limit ? payload.query.limit : 5);
    const page = Number(payload.query.page ? payload.query.page : 1);

    const filterQuery = {
        location: { $regex: location, $options: 'i' }
    }

    /!*const searchQuery = {
        // title: { $regex: searchTerm, $options: 'i' },
        $or: [
            {title:         {$regex: searchTerm, $options: 'i'}},
            {description:   {$regex: searchTerm, $options: 'i'}},
            {location:      {$regex: searchTerm, $options: 'i'}},
        ],
    }*!/

    const searchFields = ['title', 'description', 'location']
    const searchQuery = {
        $or: searchFields.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' }
        })),
    };

    const fieldsQuery  = fields.split(',').join(' ')

    const skipQuery = (page - 1) * limit;

    // We'll fetch all the tour documents from the database along with the count of all the tours
    const allTours = await TourModel
        .find(filterQuery)
        .find(searchQuery)
        .sort(sortTerm)
        .limit(limit)
        .skip(skipQuery)
        .select(fieldsQuery)                                        // Field filtering
        .populate({path: 'division', select: '-_id name'})
        .populate({path: 'tourType', select: '-_id name'});


    // const totalToursCount = await TourModel.countDocuments({});
    const totalToursCount = allTours.length;

    // Then we'll return the allTours and the totalToursCount'
    return {
        meta: {
            total: totalToursCount,
            totalPages: Math.ceil(totalToursCount / limit),
            currentPage: page,
            limit,
        },
        data: allTours
    };
}*/
/*const getAllToursService = async (payload: any) => {

    const queryBuilder = new TourQueryBuilderClass(TourModel, payload.query)
    const allTours = await queryBuilder
        .filter()
        .search()
        .sort()
        .limit()
        .skip()
        .fields()
        .paginate()                     //TODO: Aren't we applying limit and skip twice? Check very carefully.
        .build();

    const toursMeta = await queryBuilder.meta();

    // Then we'll return the allTours and the totalToursCount'
    return {
        meta2: toursMeta,
        data: allTours
    };
}*/
/* eslint-disable @typescript-eslint/no-explicit-any */
const getAllToursService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilderClass_1.TourQueryBuilderClass(tour_model_1.TourModel, payload.query);
    const allToursMethodChain = queryBuilder
        .filter()
        .search()
        .sort()
        .limit()
        .skip()
        .fields()
        .paginate(); //TODO: Aren't we applying limit and skip twice? Check very carefully.
    const allToursPromises = yield Promise.all([
        allToursMethodChain.build(),
        allToursMethodChain.meta()
    ]);
    // Then we'll return the allTours and the totalToursCount'
    return {
        data: allToursPromises[0],
        meta: allToursPromises[1]
    };
});
// The same function, 1st version, which is commented out, is not using the query builder class.
// The 2nd version, which is commented out, is using the query builder class.
// The 3rd version, which is active, is using the query builder class with method chain sequence and promises maintained properly.
/* eslint-disable @typescript-eslint/no-explicit-any */
const getSingleTourService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll extract the tour slug from the payload'
    const slug = payload.params.slug;
    (0, consolePrintFunction_1.consolePrint)(slug);
    // Then we'll check if we really have this tour slug in the database'
    const tourDocument = yield tour_model_1.TourModel.findOne({ slug: slug });
    // If the tour document is not found, then throw an error'
    if (!tourDocument) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour not found!");
    }
    // Then we'll return the tour document'
    return tourDocument;
});
/* eslint-disable @typescript-eslint/no-explicit-any */
const updateATourService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // First, we'll extract the tour id from params, the updated tour data from the payload.body and the updated tour images from the payload.files'
    const tourId = payload.params.tourId;
    const updatedTourData = payload.body;
    const updatedTourImages = ((_a = payload.files) === null || _a === void 0 ? void 0 : _a.map((file) => {
        return file.path;
    })) || [];
    // Then we'll check if we really have this tour id in the database
    const isTourIdExists = yield tour_model_1.TourModel.findById(tourId);
    if (!isTourIdExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour id not found!");
    }
    // Then we'll check if we have this tour title already in the database
    const isNewTourTitleExists = yield tour_model_1.TourModel.findOne({
        title: updatedTourData.title,
        _id: { $ne: tourId }
    });
    if (isNewTourTitleExists) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Tour title already exists!");
    }
    // Then we'll create a updated tour object for the database, with updated data
    const updatedTourObj = {
        title: updatedTourData.title ? updatedTourData.title : isTourIdExists.title,
        slug: updatedTourData.title ? (_b = updatedTourData.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().split(' ').join('-').concat('-tour-in-' + ((_c = (updatedTourData.location || isTourIdExists.location)) === null || _c === void 0 ? void 0 : _c.toLowerCase().split(' ').join('-'))) : isTourIdExists.slug,
        description: updatedTourData.description ? updatedTourData.description : isTourIdExists.description,
        images: updatedTourImages.length > 0
            ? [...(isTourIdExists.images || []).filter((img) => { var _a; return !((_a = updatedTourData.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(img)); }), ...updatedTourImages]
            : (isTourIdExists.images || []).filter((img) => { var _a; return !((_a = updatedTourData.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(img)); }),
        location: updatedTourData.location ? updatedTourData.location : isTourIdExists.location,
        costFrom: updatedTourData.costFrom ? updatedTourData.costFrom : isTourIdExists.costFrom,
        startDate: updatedTourData.startDate ? updatedTourData.startDate : isTourIdExists.startDate,
        endDate: updatedTourData.endDate ? updatedTourData.endDate : isTourIdExists.endDate,
        included: updatedTourData.included ? updatedTourData.included : isTourIdExists.included,
        excluded: updatedTourData.excluded ? updatedTourData.excluded : isTourIdExists.excluded,
        amenities: updatedTourData.amenities ? updatedTourData.amenities : isTourIdExists.amenities,
        tourPlan: updatedTourData.tourPlan ? updatedTourData.tourPlan : isTourIdExists.tourPlan,
        maxGuests: updatedTourData.maxGuests ? updatedTourData.maxGuests : isTourIdExists.maxGuests,
        minAge: updatedTourData.minAge ? updatedTourData.minAge : isTourIdExists.minAge,
        division: updatedTourData.division ? updatedTourData.division : isTourIdExists.division,
        tourType: updatedTourData.tourType ? updatedTourData.tourType : isTourIdExists.tourType,
    };
    // Then we'll update the tour in the database
    const updatedTour = yield tour_model_1.TourModel.findByIdAndUpdate(tourId, updatedTourObj, { new: true, runValidators: true });
    // If the tour images are provided in the payload, then we'll delete the old tour images from the server'
    if (updatedTourData.deleteImages && updatedTourData.deleteImages.length > 0) {
        yield Promise.all(updatedTourData.deleteImages.map((imageUrl) => {
            return (0, cloudinary_config_1.deleteAnImageFromCloudinary)(imageUrl);
        }));
    }
    // Finally, we'll return the updatedTour
    return updatedTour;
});
/* eslint-disable @typescript-eslint/no-explicit-any */
const deleteATourService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, we'll extract the tour id from the payload
    const tourId = payload.params.tourId;
    // Then we'll check if we really have this tour id in the database
    const isTourIdExists = yield tour_model_1.TourModel.findById(tourId);
    if (!isTourIdExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour id not found!");
    }
    // Then we'll delete the tour from the database
    yield tour_model_1.TourModel.findByIdAndDelete(tourId);
    const deletedTour = yield tour_model_1.TourModel.findById(tourId);
    // Finally we'll return the deleted tour proof
    return deletedTour;
});
exports.TourService = {
    createATourTypeService,
    getAllTourTypesService,
    updateATourTypeService,
    deleteATourTypeService,
    createATourService,
    getAllToursService,
    getSingleTourService,
    updateATourService,
    deleteATourService
};
