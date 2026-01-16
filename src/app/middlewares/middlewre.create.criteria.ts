import { NextFunction, Request, Response } from "express";
import { SearchCriteriaFactory } from "../modules/registration/models/searchCriteria.ts/factory";
import { SearchCriteria } from "@neon-lab-dev/platform";


export function createCriteriaMiddleware<T extends SearchCriteria> (criteriaCls: new () => T) {
    return (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const raw: Record<string, string> = {};

                for (const key in req.query) {
                    const value = req.query[key];
                
                    if (Array.isArray(value)) {
                        raw[key] = value.join(",");
                    } else if (typeof value === "string") {
                        raw[key] = value;
                    } else if (value !== undefined && value !== null) {
                        raw[key] = String(value);
                    }
                }
                const criteria = SearchCriteriaFactory.fromRequest(raw, criteriaCls)
                req.body = criteria;
                next();
            } catch (error) {
                next(error);
            }
        };
}