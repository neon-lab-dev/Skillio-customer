import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import { VerticlesServices } from "./verticles.services";

// create Verticle
const createVerticle = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name  } = req.body;
        const Verticle = await VerticlesServices.createVerticle({name });
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Verticle created successfully",
            data: Verticle,
        });
    }
);

// get all verticles
const getAllVerticles = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const verticles = await VerticlesServices.getAllVerticles();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "verticles fetched successfully",
        data: verticles,
    });
})

// get Verticle by id
const getVerticleById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const Verticle = await VerticlesServices.getVerticleById(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Verticle fetched successfully",
        data: Verticle,
    });
});

// update Verticle
const updateVerticle = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedVerticle = await VerticlesServices.updateVerticle(id,res, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Verticle updated successfully",
        data: updatedVerticle,
    });
});

// delete Verticle
const deleteVerticle = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedVerticle = await VerticlesServices.deleteVerticle(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Verticle deleted successfully",
        data: deletedVerticle,
    });
});

export const verticlesController = {
    createVerticle,
    getAllVerticles,
    getVerticleById,
    updateVerticle,
    deleteVerticle,
};