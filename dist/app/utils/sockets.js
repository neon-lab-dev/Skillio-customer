"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUsers = exports.getIO = exports.initializeSocket = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("./logger"));
const onlineRepository_1 = __importDefault(require("../repository/onlineRepository"));
const registrationEnum_1 = require("../modules/registration/enums/registrationEnum");
const onlineUsers = new Map();
exports.onlineUsers = onlineUsers;
let io;
const initializeSocket = (app) => {
    const server = http_1.default.createServer(app);
    io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
            credentials: true,
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        logger_1.default.info(`Socket connected: ${socket.id}`);
        socket.on("register", async (data) => {
            const profileId = typeof data === "string" ? data : data.profileId;
            onlineUsers.set(profileId, socket.id);
            io.emit("userStatusChanged", { profileId, isOnline: true });
            await onlineRepository_1.default.upsertOnlineStatus(profileId, {
                status: registrationEnum_1.onlineStatus.ONLINE
            });
            logger_1.default.info(`User ${profileId} is now online`);
        });
        socket.on("typing", ({ senderId, recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("typing", { senderId, isTyping: true });
            }
        });
        socket.on("stopTyping", ({ senderId, recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("typing", { senderId, isTyping: false });
            }
        });
        socket.on("disconnect", async () => {
            for (const [profileId, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                    onlineUsers.delete(profileId);
                    io.emit("userStatusChanged", { profileId, isOnline: false });
                    await onlineRepository_1.default.updateByProfileId(profileId, {
                        status: registrationEnum_1.onlineStatus.OFFLINE,
                        lastSeen: new Date()
                    });
                    logger_1.default.info(`User ${profileId} is now offline`);
                    break;
                }
            }
        });
    });
    return server;
};
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized! Call initializeSocket() first.");
    }
    return io;
};
exports.getIO = getIO;
