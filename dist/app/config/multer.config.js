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
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = __importDefault(require("./cloudinary.config"));
const node_path_1 = __importDefault(require("node:path"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const base = node_path_1.default.parse(file.originalname).name; // name without extension
        const fileName = base === null || base === void 0 ? void 0 : base.toLowerCase().replace(/[._\s]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
        const uniqueNumber = Math.random().toString(36).slice(2);
        const extension = node_path_1.default.parse(file.originalname).ext;
        if (!extension) {
            throw new Error('File extension is missing!');
        }
        // const uniqueFileName = `${fileName}-${uniqueNumber}-${Date.now()}${extension}`;
        const uniqueFileName = `${fileName}-${uniqueNumber}-${Date.now()}`;
        // consolePrint(uniqueFileName);
        return {
            folder: 'PHNLB5_M32_PH_Tour_Mng_Proj',
            public_id: uniqueFileName,
        };
    })
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
