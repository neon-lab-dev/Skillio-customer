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
exports.verticlesController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const verticles_services_1 = require("./verticles.services");
// create Verticle
const createVerticle = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const Verticle = yield verticles_services_1.VerticlesServices.createVerticle({ name });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Verticle created successfully",
        data: Verticle,
    });
}));
// get all verticles
const getAllVerticles = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verticles = yield verticles_services_1.VerticlesServices.getAllVerticles();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "verticles fetched successfully",
        data: verticles,
    });
}));
// get Verticle by id
const getVerticleById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const Verticle = yield verticles_services_1.VerticlesServices.getVerticleById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Verticle fetched successfully",
        data: Verticle,
    });
}));
// update Verticle
const updateVerticle = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedVerticle = yield verticles_services_1.VerticlesServices.updateVerticle(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Verticle updated successfully",
        data: updatedVerticle,
    });
}));
// delete Verticle
const deleteVerticle = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedVerticle = yield verticles_services_1.VerticlesServices.deleteVerticle(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Verticle deleted successfully",
        data: deletedVerticle,
    });
}));
exports.verticlesController = {
    createVerticle,
    getAllVerticles,
    getVerticleById,
    updateVerticle,
    deleteVerticle,
};
