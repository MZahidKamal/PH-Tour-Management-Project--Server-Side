"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionModel = void 0;
const mongoose_1 = require("mongoose");
const divisionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Division name is required!"],
        unique: [true, "Division name already exists!"],
        minlength: [3, "Division name must be at least 3 characters long!"],
        maxlength: [20, "Division name must be at most 100 characters long!"],
        trim: true,
    },
    slug: {
        type: String,
        unique: [true, "Division slug already exists!"]
    },
    thumbnail: {
        type: String,
    },
    description: {
        type: String,
        minlength: [10, "Description must be at least 10 characters long!"],
        maxlength: [100, "Description must be at most 100 characters long!"],
        trim: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.DivisionModel = (0, mongoose_1.model)('DivisionModel', divisionSchema);
exports.default = exports.DivisionModel;
