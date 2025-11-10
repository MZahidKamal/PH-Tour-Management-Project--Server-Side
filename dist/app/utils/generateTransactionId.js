"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = void 0;
const generateTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
exports.generateTransactionId = generateTransactionId;
