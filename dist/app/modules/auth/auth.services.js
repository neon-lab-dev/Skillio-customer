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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const appError_1 = __importDefault(require("../../errors/appError"));
const auth_utils_1 = require("./auth.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const config_1 = __importDefault(require("../../config"));
// create user
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, designation, linkedInUrl, writeUp, password, station, photo } = payload;
    if (!name || !designation || !linkedInUrl || !writeUp || !password || !station) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const user = yield prismaDb_1.default.user.create({
        data: {
            name,
            designation,
            linkedInUrl,
            writeUp,
            password: hashedPassword,
            station,
            photo: {
                create: {
                    fileId: photo === null || photo === void 0 ? void 0 : photo.fileId,
                    name: photo === null || photo === void 0 ? void 0 : photo.name,
                    url: photo === null || photo === void 0 ? void 0 : photo.url,
                    thumbnailUrl: photo === null || photo === void 0 ? void 0 : photo.thumbnailUrl
                }
            }
        },
    });
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
// login user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = payload;
    if (!name || !password) {
        throw new appError_1.default(400, "Please provide all fields");
    }
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            name: name,
        },
    });
    if (!user) {
        throw new appError_1.default(401, "Invalid credentials");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(401, "Invalid credentials");
    }
    const jwtPayload = {
        userId: user.id.toString(),
        name: user.name,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user
    };
});
// refresh token service to get new access token using refresh token
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new appError_1.default(401, "Please provide refresh token");
    }
    const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
    const { name } = decoded;
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            name: name,
        },
    });
    if (!user) {
        throw new appError_1.default(401, "user not found");
    }
    const jwtPayload = {
        userId: user.id.toString(),
        name: user.name
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
// get all users
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaDb_1.default.user.findMany();
    if (!users || users.length === 0) {
        throw new appError_1.default(404, "No users found");
    }
    return users.map((user) => {
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    });
});
// get user by id
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: id,
        },
    });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.authServices = {
    createUser,
    loginUser,
    refreshToken,
    getUsers,
    getUserById
};
