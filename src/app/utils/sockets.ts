import http from "http";
import { Server } from "socket.io";
import type { Application } from "express";
import logger from "./logger";
import onlineRepository from "../repository/onlineRepository";
import { onlineStatus } from "../modules/registration/enums/registrationEnum";

const onlineUsers = new Map<string, string>();
 
let io: Server;

export const initializeSocket = (app: Application) => {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST"],
    },
  });


  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on("register" , async(data)=>{
      const profileId=typeof data==="string"? data : data.profileId;
      onlineUsers.set(profileId, socket.id);

      io.emit("userStatusChanged", { profileId, isOnline: true });

      await onlineRepository.upsertOnlineStatus(profileId,{
        status: onlineStatus.ONLINE
      }) 
      
      logger.info(`User ${profileId} is now online`);
    })

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


    socket.on("disconnect", async() => {
      for (const [profileId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(profileId);
          io.emit("userStatusChanged", { profileId, isOnline: false });
          await onlineRepository.updateByProfileId(profileId,{
            status: onlineStatus.OFFLINE,
            lastSeen: new Date()
          })
          logger.info(`User ${profileId} is now offline`);
          break;
        }
      }
    });
  });

  return server;
};


export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized! Call initializeSocket() first.");
  }
  return io;
};

export { onlineUsers };