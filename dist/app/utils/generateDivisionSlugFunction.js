"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDivisionSlugFunction = void 0;
const generateDivisionSlugFunction = (name) => {
    return name.toLowerCase().split(' ').join('-').concat('-division');
};
exports.generateDivisionSlugFunction = generateDivisionSlugFunction;
