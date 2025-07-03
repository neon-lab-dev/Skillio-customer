import { TUser , TLoginAuth  , Tpeople} from "./auth.interface";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import {createToken} from "./auth.utils"
import jwt , {JwtPayload}from "jsonwebtoken";
import { Request, Response } from "express";

import prismadb from "../../db/prismaDb";
import config from "../../config";
import sendResponse from "../../middlewares/sendResponse";



// create user
const createUser = async (payload: Partial<TUser>) => {
  const { name , designation , linkedInUrl ,role, writeUp ,  password , station  , email } = payload;

    if(!name || !designation || !linkedInUrl || !writeUp || !password || !station || !email || !role) {
    throw new AppError(400, "Please provide all fields"); 
    }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


    const user= await prismadb.user.create({
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

    console.log("Login request:", email, password);

    const user = await prismadb.user.findFirst({
        where: {
            email: email,
        }
    });

    console.log("User found:", user);

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError(401, "Invalid credentials");
    }

    const jwtPayload = {
        userId: user.id.toString(),
        role: user.role
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

// create people
const createPeople = async (payload: Partial<Tpeople>) => {
  const { name , designation , linkedInUrl , writeUp  , station ,photo , email } = payload;

    if(!name || !designation || !linkedInUrl || !writeUp  || !station || !email ) {
    throw new AppError(400, "Please provide all fields"); 
    }


let people;
if(photo){
     people = await prismadb.people.create({
      data: {
        name,
        email,
        designation,
        linkedInUrl,
        writeUp,
        station,
        photo: {
          create: {
            fileId: photo?.fileId ,
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


    return people;
}

people= await prismadb.people.create({
    data: {
      name,
      email,
      designation,
      linkedInUrl,
      writeUp,
      station,
    }
  });


  return people;
}


// get all people
const getPeople = async () => {
    const people = await prismadb.people.findMany(
        {
            include:{
                photo: {
                    select:{
                        url: true
                    }
                }
            }
        }
    );
    if (!people || people.length === 0) {
        throw new AppError(404, "No People found");
    }
    return people
}

// get people by id
const getPeopleById = async (id: string) => {
    const people = await prismadb.people.findFirst({
        where: {
            id: id,
        },
        include: {
            photo: {
                select:{
                    url: true
                }
            }
        }
    });

    if (!people) {
        throw new AppError(404, "People not found");
    }

    return people;
}

// delete people
const deletePeople= async (id: string , res:Response) => {
    const people = await prismadb.people.findFirst({
        where: {
            id: id,
        },
    });

    if (!people) {
       return(
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "People not found with this id",
        }
        )
       )
    }

    await prismadb.people.delete({
        where: {
            id: id,
        },
    });

    return { message: "People deleted successfully" };
}

// update people
const updatePeople= async (id: string, payload: Partial<Tpeople> , req:Request) => {
    const { name, designation, linkedInUrl, writeUp, station, photo } = payload;

    if (!name || !designation || !linkedInUrl || !writeUp  || !station) {
        throw new AppError(400, "Please provide all fields");
    }

    const people = await prismadb.people.findFirst({
        where: {
            id: id,
        },
    });

    if (!people) {
        throw new AppError(404, "User not found");
    }

    const peoplePhoto= await prismadb.photo.findFirst({
        where: {
            peopleId: people.id
        }
    });

    let updatedPeople;



    if(photo !== undefined){
        await prismadb.photo.deleteMany({
            where:{
                peopleId: people.id
            }
        })

          updatedPeople = await prismadb.people.update({
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
                     create: {
                        fileId: photo?.fileId,
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

         return {people:updatedPeople};
    }
    updatedPeople= await prismadb.people.update({
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
                    name: peoplePhoto?.name as string,
                    url: peoplePhoto?.url as string,
                    thumbnailUrl: peoplePhoto?.thumbnailUrl as string
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


    return {people:updatedPeople};
}


export const authServices = {
    createUser,
    loginUser,
    refreshToken,
    createPeople,
    getPeople,
    getPeopleById,
    deletePeople,
    updatePeople
};