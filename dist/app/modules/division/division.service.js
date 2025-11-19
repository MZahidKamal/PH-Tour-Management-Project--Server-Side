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
exports.DivisionServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const division_model_1 = __importDefault(require("./division.model"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const generateDivisionSlugFunction_1 = require("../../utils/generateDivisionSlugFunction");
const generateDivisionThumbnailFunction_1 = require("../../utils/generateDivisionThumbnailFunction");
const consolePrintFunction_1 = require("../../utils/consolePrintFunction");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createADivisionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Now data is already parsed, no need to parse again, only need to destruct the data'
    (0, consolePrintFunction_1.consolePrint)(payload.body);
    (0, consolePrintFunction_1.consolePrint)(payload.file);
    const { name, description } = payload.body; // Changed from payload.body.data to payload.body
    const { path: thumbnailImageUrl } = payload === null || payload === void 0 ? void 0 : payload.file;
    // First we'll check if we have this division already in the database'
    const isDivisionExist = yield division_model_1.default.findOne({ name: name });
    if (isDivisionExist) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Division already exists!");
    }
    // If the division is not exist, then create a new division object for the database'
    const newDivisionObj = {
        name: name,
        slug: (0, generateDivisionSlugFunction_1.generateDivisionSlugFunction)(name),
        thumbnail: thumbnailImageUrl ? thumbnailImageUrl : (0, generateDivisionThumbnailFunction_1.generateDivisionThumbnailFunction)(name),
        description: description,
    };
    // Then save the new division object in the database'
    const newDivision = yield division_model_1.default.create(newDivisionObj);
    // Finally we'll return the newDivision
    return newDivision;
});
const getAllDivisionsService = () => __awaiter(void 0, void 0, void 0, function* () {
    // First we'll get all the divisions from the database'
    const allDivision = yield division_model_1.default.find({});
    // Then we'll get the total count of all the divisions from the database'
    const totalDivisionsCount = yield division_model_1.default.countDocuments({});
    // Finally we'll return the allDivision and the totalDivisionsCount'
    return {
        data: allDivision,
        meta: {
            total: totalDivisionsCount,
        }
    };
});
const getSingleDivisionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = payload.params.slug;
    (0, consolePrintFunction_1.consolePrint)(slug);
    // First we'll get all the divisions from the database'
    const singleDivision = yield division_model_1.default.findOne({ slug: slug });
    // Then we'll check if we really have this division in the database'
    if (!singleDivision) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division not found!");
    }
    // If yes, then finally we'll return the singleDivision'
    return singleDivision;
});
const updateADivisionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring the payload
    const divisionId = (payload.params.divisionId);
    const { name, description } = (payload.body);
    const { path: thumbnailImageUrl } = payload.file;
    // First we'll check if we really have this division id in the database'
    const isDivisionIdExists = yield division_model_1.default.findById(divisionId);
    if (!isDivisionIdExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division id not found!");
    }
    // Then we'll check if we have this division name already in the database'
    const isNewDivisionNameExists = yield division_model_1.default.findOne({
        name: name,
        _id: { $ne: divisionId }
    });
    if (isNewDivisionNameExists) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Division name already exists!");
    }
    // Then we'll create a new division object for the database, with updated data'
    const updatedDivisionObj = {
        name: name ? name : isDivisionIdExists.name,
        slug: name ? (0, generateDivisionSlugFunction_1.generateDivisionSlugFunction)(name) : isDivisionIdExists.slug,
        // thumbnail: name? generateDivisionThumbnailFunction(name) : isDivisionIdExists.thumbnail,
        thumbnail: thumbnailImageUrl ? thumbnailImageUrl : (0, generateDivisionThumbnailFunction_1.generateDivisionThumbnailFunction)(name),
        description: description ? description : isDivisionIdExists.description,
    };
    // Then we'll update the division in the database'
    const updatedDivision = yield division_model_1.default.findByIdAndUpdate(divisionId, updatedDivisionObj, { new: true, runValidators: true });
    // If the thumbnail image is provided, then we'll delete the old thumbnail image of the division from the database'
    if (thumbnailImageUrl && isDivisionIdExists.thumbnail) {
        (0, consolePrintFunction_1.consolePrint)("Deleting old thumbnail image from cloudinary:", isDivisionIdExists.thumbnail);
        yield (0, cloudinary_config_1.deleteAnImageFromCloudinary)(isDivisionIdExists.thumbnail);
    }
    // Finally we'll return the updatedDivision'
    return updatedDivision;
});
const deleteADivisionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Extracting the payload
    const divisionId = (payload.params.divisionId);
    // First we'll check if we really have this division id in the database'
    const isDivisionIdExists = yield division_model_1.default.findById(divisionId);
    if (!isDivisionIdExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division id not found!");
    }
    // Then we'll delete the division from the database'
    yield division_model_1.default.findByIdAndDelete(divisionId);
    const deletedDivision = yield division_model_1.default.findById(divisionId);
    // Finally we'll return the deleted Division proof'
    return deletedDivision;
});
exports.DivisionServices = {
    createADivisionService,
    getAllDivisionsService,
    getSingleDivisionService,
    updateADivisionService,
    deleteADivisionService,
};
