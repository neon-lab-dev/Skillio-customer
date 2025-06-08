import { TUser , TLoginAuth } from "./auth.interface";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import {createToken} from "./auth.utils"
import jwt , {JwtPayload}from "jsonwebtoken";

import prismadb from "../../db/prismaDb";
import config from "../../config";



// create user
const createUser = async (payload: Partial<TUser>) => {
  const { name , designation , linkedInUrl , writeUp ,  password , station ,photo } = payload;

  if (!name || !designation || !linkedInUrl || !writeUp || !password || !station) {
    throw new AppError(400, "please provide all fields");
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const user = await prismadb.user.create({
    data: {
      name,
      designation,
      linkedInUrl,
      writeUp,
      password: hashedPassword,
      station,
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

  return userWithoutPassword;
}

// login user
const loginUser = async (payload: TLoginAuth) => {
    const { name, password } = payload;

    if (!name || !password) {
        throw new AppError(400, "Please provide all fields");
    }

    const user = await prismadb.user.findFirst({
        where: {
            name: name,
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

    const {name}= decoded as {name:string};

    const user = await prismadb.user.findFirst({
        where: {
            name: name,
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
    const users = await prismadb.user.findMany();
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
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}



export const authServices = {
    createUser,
    loginUser,
    refreshToken,
    getUsers,
    getUserById
};