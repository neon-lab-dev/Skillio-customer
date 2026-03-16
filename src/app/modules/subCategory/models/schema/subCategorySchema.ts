import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform"
import z from "zod"

const categoryIdSchema= IS_MANDATORY_SCHEMA("categoryId")

export const createSubCategorySchema=z.object({
    name: IS_MANDATORY_SCHEMA("name"),
    categoryId: categoryIdSchema
}
).strict()

export const fetchSubCategorySchema= z.object({
    categoryId: categoryIdSchema
}).strict()