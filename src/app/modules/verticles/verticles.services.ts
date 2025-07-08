import { TVerticle } from "./verticles.interface";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import { Response } from "express";
import sendResponse from "../../middlewares/sendResponse";

// create Verticle
const createVerticle = async (verticle: TVerticle) => {
    const { name } = verticle;
    if (!name ) {
        throw new AppError(400, "name field is required");
    }
    const existingVerticle = await prismadb.verticles.findFirst({
        where: {
            name: name,
        },
    });
    if (existingVerticle) {
        throw new AppError(400, "Verticle already exists with this name");
    }
    const Verticle = await prismadb.verticles.create({
        data: {
            name , 
        },
    });
    return {Verticle};
}

// get all Verticles
const getAllVerticles = async () => {
    const Verticles = await prismadb.verticles.findMany();
    if (!Verticles) {
        throw new AppError(404, "No Verticles found");
    }
    return {Verticles};
}

// get Verticle by id
const getVerticleById= async (VerticleId: string , res: Response) => {
    const Verticle = await prismadb.verticles.findFirst({
        where: {
            id: VerticleId,
        }
    });
    if (!Verticle) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Verticle not found with this id",
            })
        )
    }
    return {Verticle};
}

// update Verticle
const updateVerticle = async (VerticleId: string,res: Response, Verticle: Partial<TVerticle>) => {
    const { name } = Verticle;
    if (!name) {
        throw new AppError(400, "please provide all fields");
    }
    const existingVerticle = await prismadb.verticles.findFirst({
        where: {
            id: VerticleId,
        },
    });
    if (!existingVerticle) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Verticle not found with this id",
            })
        )
    }
    const updatedVerticle = await prismadb.verticles.update({
        where: {
            id: VerticleId,
        },
        data: {
            name
        },
    });
    return {updatedVerticle};
}

// delete Verticle
const deleteVerticle = async (VerticleId: string ,res: Response) => {
    const existingVerticle = await prismadb.verticles.findFirst({
        where: {
            id: VerticleId,
        },
    });
    if (!existingVerticle) {
        return(
            sendResponse(res, {
                statusCode: 404,    
                success: false,
                message: "Verticle not found with this id",
            })
        )
    }
    const deletedVerticle = await prismadb.verticles.delete({
        where: {
            id: VerticleId,
        },
    });
    return {deletedVerticle};
}


export const VerticlesServices = {
    createVerticle,
    getAllVerticles,
    getVerticleById,
    updateVerticle,
    deleteVerticle,
};