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
exports.authControllers = void 0;
const auth_services_1 = require("./auth.services");
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const config_1 = __importDefault(require("../../config"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const uploadImage_1 = require("../../utils/uploadImage");
const getDataUri_1 = __importDefault(require("../../utils/getDataUri"));
// sigup controller
const createUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, designation, linkedInUrl, writeUp, email, password, role, station } = req.body;
    const user = yield auth_services_1.authServices.createUser({ name, designation, email, linkedInUrl, writeUp, role, password, station });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user,
    });
}));
// login user controller
const loginUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield auth_services_1.authServices.loginUser({ email, password });
    const { accessToken, user } = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
            user: user,
            accessToken: accessToken,
        }
    });
}));
// refresh token to get new access token controller
const refreshToken = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Please login to access this resource",
            data: null,
        });
    }
    const result = yield auth_services_1.authServices.refreshToken(refreshToken);
    const { accessToken } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Access token refreshed successfully",
        data: {
            accessToken: accessToken
        },
    });
}));
// create people
const createPeople = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, designation, linkedInUrl, writeUp, email, station, verticles, category } = req.body;
    let photo = undefined;
    if (req.file) {
        photo = yield (0, uploadImage_1.uploadImage)((0, getDataUri_1.default)(req.file).content, (0, getDataUri_1.default)(req.file).fileName, "people");
        if (!photo) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    const poeple = yield auth_services_1.authServices.createPeople({ name, designation, email, linkedInUrl, writeUp, station, photo, verticles, category });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "poeple created successfully",
        data: poeple,
    });
}));
// get all users controller
const getAllPeople = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const people = yield auth_services_1.authServices.getPeople();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "people fetched successfully",
        data: people,
    });
}));
// get single user controller
const getSinglePeople = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const people = yield auth_services_1.authServices.getPeopleById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "people fetched successfully",
        data: people,
    });
}));
// delete user controller
const deletePeople = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedPeople = yield auth_services_1.authServices.deletePeople(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: deletedPeople,
    });
}));
// update user controller
const updatePeople = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, designation, linkedInUrl, writeUp, station, verticles, category } = req.body;
    let photo = undefined;
    if (req.file) {
        photo = yield (0, uploadImage_1.uploadImage)((0, getDataUri_1.default)(req.file).content, (0, getDataUri_1.default)(req.file).fileName, "user");
        if (!photo) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    const people = yield auth_services_1.authServices.updatePeople(id, { name, designation, linkedInUrl, writeUp, station, photo, verticles, category });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "People updated successfully",
        data: people,
    });
}));
exports.authControllers = {
    createUser,
    loginUser,
    refreshToken,
    createPeople,
    getAllPeople,
    getSinglePeople,
    deletePeople,
    updatePeople
};
