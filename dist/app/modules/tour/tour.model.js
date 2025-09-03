"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourModel = exports.TourTypeModel = void 0;
const mongoose_1 = require("mongoose");
const tourTypeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Tour type name is required!"],
        unique: [true, "Tour type name already exists!"],
        minlength: [3, "Tour type name must be at least 3 characters long!"],
        maxlength: [50, "Tour type name must be at most 50 characters long!"],
        trim: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.TourTypeModel = (0, mongoose_1.model)('TourTypeModel', tourTypeSchema);
const tourSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Tour name is required!"],
        unique: [true, "Tour name already exists!"],
        minlength: [3, "Tour name must be at least 3 characters long!"],
        maxlength: [50, "Tour name must be at most 100 characters long!"],
        trim: true,
    },
    slug: {
        type: String,
        unique: [true, "Tour slug already exists!"]
    },
    description: {
        type: String,
        minlength: [10, "Description must be at least 10 characters long!"],
        maxlength: [1000, "Description must be at most 100 characters long!"],
        trim: true,
        default: ''
    },
    images: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        minlength: [3, "Location must be at least 3 characters long!"],
        maxlength: [100, "Location must be at most 100 characters long!"],
        trim: true,
    },
    costFrom: {
        type: Number,
        min: [0, "Cost from must be at least 0!"],
    },
    departureLocation: {
        type: Object,
    },
    arrivalLocation: {
        type: Object,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    included: {
        type: [String],
        default: []
    },
    excluded: {
        type: [String],
        default: []
    },
    amenities: {
        type: [String],
        default: []
    },
    tourPlan: {
        type: [String],
        default: []
    },
    maxGuests: {
        type: Number,
        min: [2, "Max guests must be at least 1!"],
    },
    minAge: {
        type: Number,
        min: [18, "Min age must be at least 18!"],
    },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'DivisionModel',
        required: [true, "Division is required!"],
    },
    tourType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TourTypeModel',
        required: [true, "Tour type is required!"],
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.TourModel = (0, mongoose_1.model)('TourModel', tourSchema);
