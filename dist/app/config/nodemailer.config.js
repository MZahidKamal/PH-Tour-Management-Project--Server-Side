"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
/* eslint-disable @typescript-eslint/no-explicit-any */
const nodemailer = __importStar(require("nodemailer"));
const envConfig_1 = __importDefault(require("./envConfig"));
const consolePrintFunction_1 = require("../utils/consolePrintFunction");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const node_path_1 = __importDefault(require("node:path"));
const ejs_1 = __importDefault(require("ejs"));
const nodemailerTransporter = nodemailer.createTransport({
    host: envConfig_1.default.nodemailer_smtp_host,
    port: Number(envConfig_1.default.nodemailer_smtp_port),
    secure: envConfig_1.default.nodemailer_smtp_port === "465", // True for 465, false for other ports
    auth: {
        user: envConfig_1.default.gmail_address,
        pass: envConfig_1.default.gmail_app_password
    }
});
const sendAnEmailToTheUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const templatePath = node_path_1.default.join(__dirname, `../htmlTemplates/${payload.emailTemplateName}`);
        const templateData = payload.emailTemplateData || {};
        const constructedHTMLContent = yield ejs_1.default.renderFile(templatePath, templateData);
        const info = yield nodemailerTransporter.sendMail({
            from: envConfig_1.default.gmail_address,
            to: payload.targetEmail,
            subject: payload.emailSubject,
            html: constructedHTMLContent,
            attachments: ((_a = payload.attachments) === null || _a === void 0 ? void 0 : _a.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType || 'text/html'
            }))) || []
        });
        if (info === null || info === void 0 ? void 0 : info.messageId) {
            (0, consolePrintFunction_1.consolePrint)('Email sent successfully to: ', payload.targetEmail, 'Subject: ', payload.emailSubject);
            return info;
        }
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)('Failed to send email to:', payload.targetEmail, 'Error:', error);
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, `Failed to send email to ${payload.targetEmail}. Please try again later.`);
    }
});
exports.default = sendAnEmailToTheUser;
/*
Use this function to send an email to the user:

await sendAnEmailToTheUser({
    targetEmail: 'kamal.md.zahid@gmail.com',
    emailSubject: "Welcome to PH Tour Management Project",
    emailTemplateName: 'forgetPasswordEmail.template.ejs',
    emailTemplateData: {name: 'Kamal Zahid', resetUILink: 'https://www.google.com/'},
    attachments: []
})
*/
