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
exports.VerticlesServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create Verticle
const createVerticle = (verticle) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = verticle;
    if (!name) {
        throw new appError_1.default(400, "name field is required");
    }
    const existingVerticle = yield prismaDb_1.default.verticles.findFirst({
        where: {
            name: name,
        },
    });
    if (existingVerticle) {
        throw new appError_1.default(400, "Verticle already exists with this name");
    }
    const Verticle = yield prismaDb_1.default.verticles.create({
        data: {
            name,
        },
    });
    return { Verticle };
});
// get all Verticles
const getAllVerticles = () => __awaiter(void 0, void 0, void 0, function* () {
    const Verticles = yield prismaDb_1.default.verticles.findMany();
    if (!Verticles) {
        throw new appError_1.default(404, "No Verticles found");
    }
    return { Verticles };
});
// get Verticle by id
const getVerticleById = (VerticleId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Verticle = yield prismaDb_1.default.verticles.findFirst({
        where: {
            id: VerticleId,
        }
    });
    if (!Verticle) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Verticle not found with this id",
        }));
    }
    return { Verticle };
});
// update Verticle
const updateVerticle = (VerticleId, res, Verticle) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = Verticle;
    if (!name) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingVerticle = yield prismaDb_1.default.verticles.findFirst({
        where: {
            id: VerticleId,
        },
    });
    if (!existingVerticle) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Verticle not found with this id",
        }));
    }
    const updatedVerticle = yield prismaDb_1.default.verticles.update({
        where: {
            id: VerticleId,
        },
        data: {
            name
        },
    });
    return { updatedVerticle };
});
// delete Verticle
const deleteVerticle = (VerticleId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingVerticle = yield prismaDb_1.default.verticles.findFirst({
        where: {
            id: VerticleId,
        },
    });
    if (!existingVerticle) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Verticle not found with this id",
        }));
    }
    const deletedVerticle = yield prismaDb_1.default.verticles.delete({
        where: {
            id: VerticleId,
        },
    });
    return { deletedVerticle };
});
exports.VerticlesServices = {
    createVerticle,
    getAllVerticles,
    getVerticleById,
    updateVerticle,
    deleteVerticle,
};
