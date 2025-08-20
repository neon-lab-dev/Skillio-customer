import { TCategory } from "./categories.interface";
import prismadb from "../../db/dataSource";
import AppError from "../../errors/appError";
import { Response } from "express";
import sendResponse from "../../middlewares/sendResponse";

// create category
const createCategory = async (category: TCategory) => {
    const { name } = category;
    if (!name ) {
        throw new AppError(400, "name field is required");
    }
    const existingCategory = await prismadb.category.findFirst({
        where: {
            name: name,
        },
    });
    if (existingCategory) {
        throw new AppError(400, "Category already exists with this name");
    }
    const Category = await prismadb.category.create({
        data: {
            name , 
        },
    });
    return {Category};
}

// get all categories
const getAllCategories = async () => {
    const categories = await prismadb.category.findMany();
    if (!categories) {
        throw new AppError(404, "No categories found");
    }
    return {categories};
}

// get category by id
const getCategoryById= async (categoryId: string , res: Response) => {
    const category = await prismadb.category.findFirst({
        where: {
            id: categoryId,
        }
    });
    if (!category) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Category not found with this id",
            })
        )
    }
    return {category};
}

// update category
const updateCategory = async (categoryId: string,res: Response, category: Partial<TCategory>) => {
    const { name } = category;
    if (!name) {
        throw new AppError(400, "please provide all fields");
    }
    const existingCategory = await prismadb.category.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Category not found with this id",
            })
        )
    }
    const updatedCategory = await prismadb.category.update({
        where: {
            id: categoryId,
        },
        data: {
            name
        },
    });
    return {updatedCategory};
}

// delete category
const deleteCategory = async (categoryId: string ,res: Response) => {
    const existingCategory = await prismadb.category.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        return(
            sendResponse(res, {
                statusCode: 404,    
                success: false,
                message: "Category not found with this id",
            })
        )
    }
    const deletedCategory = await prismadb.category.delete({
        where: {
            id: categoryId,
        },
    });
    return {deletedCategory};
}


export const categoriesServices = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};