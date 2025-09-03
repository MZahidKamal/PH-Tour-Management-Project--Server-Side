"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDivisionThumbnailFunction = void 0;
const generateDivisionThumbnailFunction = (name) => {
    return name.toLowerCase().split(' ').join('-').concat('-division-thumbnail.jpg');
};
exports.generateDivisionThumbnailFunction = generateDivisionThumbnailFunction;
