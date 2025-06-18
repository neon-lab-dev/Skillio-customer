import { TUser , TLoginAuth } from "./auth.interface";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import {createToken} from "./auth.utils"
import jwt , {JwtPayload}from "jsonwebtoken";
import { Response } from "express";

import prismadb from "../../db/prismaDb";
import config from "../../config";
import sendResponse from "../../middlewares/sendResponse";



// create user
const createUser = async (payload: Partial<TUser>) => {
  const { name , designation , linkedInUrl ,role, writeUp ,  password , station ,photo , email } = payload;

    if(!name || !designation || !linkedInUrl || !writeUp || !password || !station || !email || !role) {
    throw new AppError(400, "Please provide all fields"); 
    }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

let user;
if(photo){
     user = await prismadb.user.create({
      data: {
        name,
        email,
        designation,
        linkedInUrl,
        writeUp,
        password: hashedPassword,
        station,
        role,
        photo: {
          create: {
            fileId: photo?.fileId,
            name: photo?.name as string,
            url: photo?.url as string,
            thumbnailUrl: photo?.thumbnailUrl as string
          }
        }
      },
      include:{
          photo: true
      }
    });

  const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword
}

user= await prismadb.user.create({
    data: {
      name,
      email,
      designation,
      linkedInUrl,
      writeUp,
      password: hashedPassword,
      station,
      role,
    }
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

// login user
const loginUser = async (payload: TLoginAuth) => {
    const { email, password } = payload;

    if(!email){
        throw new AppError(400, "Please provide email");
    }
    if(!password){
        throw new AppError(400, "Please provide password");
    }

    const user = await prismadb.user.findFirst({
        where: {
            email: email,
        },
        include:{
            photo: true
        }
    });

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError(401, "Invalid credentials");
    }

    const jwtPayload = {
        userId: user.id.toString(),
        name: user.name,
      };
    
      const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
      );
    
      const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
      );
    
      return {
        accessToken,
        refreshToken,
        user
      }
}

// refresh token service to get new access token using refresh token
const refreshToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError(401, "Please provide refresh token");
    }

    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;

    const {email}= decoded as {email:string};

    const user = await prismadb.user.findFirst({
        where: {
            email: email,
        },
    });

    if(!user) {
        throw new AppError(401, "user not found");
    }

    const jwtPayload = {
        userId: user.id.toString(),
        name: user.name
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    return {accessToken};
}

// get all users
const getUsers = async () => {
    const users = await prismadb.user.findMany(
        {
            include:{
                photo: true
            }
        }
    );
    if (!users || users.length === 0) {
        throw new AppError(404, "No users found");
    }
    return users.map((user:TUser) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
}

// get user by id
const getUserById = async (id: string) => {
    const user = await prismadb.user.findFirst({
        where: {
            id: id,
        },
        include: {
            photo: true
        }
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

// delete user
const deleteUser= async (id: string , res:Response) => {
    const user = await prismadb.user.findFirst({
        where: {
            id: id,
        },
    });

    if (!user) {
       return(
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not found with this id",
        }
        )
       )
    }

    await prismadb.user.delete({
        where: {
            id: id,
        },
    });

    return { message: "User deleted successfully" };
}

// update user
const updateUser= async (id: string, payload: Partial<TUser>) => {
    const { name, designation, linkedInUrl, writeUp, station, photo } = payload;

    if (!name || !designation || !linkedInUrl || !writeUp  || !station) {
        throw new AppError(400, "Please provide all fields");
    }

    const user = await prismadb.user.findFirst({
        where: {
            id: id,
        },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const userPhoto= await prismadb.photo.findFirst({
        where: {
            userId: user.id
        }
    });

    let updatedUser;

    if(photo !== undefined){
          updatedUser = await prismadb.user.update({
             where: {
                 id: id, 
             },
             data: {
                 name,
                 designation,
                 linkedInUrl,
                 writeUp,
                 station,
                 photo: {
                     update: {
                         name: photo?.name as string,
                         url: photo?.url as string,
                         thumbnailUrl: photo?.thumbnailUrl as string
                     }
                 }
             },
             include:{
                 photo: {
                        select: {
                            url: true
                        }
                 }
             }
         });

         return {user:updatedUser};
    }
    updatedUser= await prismadb.user.update({
        where: {
            id: id,
        },
        data: {
            name,
            designation,
            linkedInUrl,
            writeUp,
            station,
            photo:{
                update:{
                    name: userPhoto?.name as string,
                    url: userPhoto?.url as string,
                    thumbnailUrl: userPhoto?.thumbnailUrl as string
                }
            }
        },
        include: {
            photo: {
                select:{
                    url: true
                }
            }
        }
    });


    return {user:updatedUser};
}


export const authServices = {
    createUser,
    loginUser,
    refreshToken,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
};