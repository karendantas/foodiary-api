import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { HttpResponse, ProtectedHttpRequest } from "../types/http";
import { badRequest, ok } from "../utils/http";

import z from 'zod'
import { mealsTable } from "../db/schema";

const schema = z.object({
    mealId: z.uuid()
})
export class GetMealByIdController {
    static async handle({userId, params}: ProtectedHttpRequest): Promise<HttpResponse>{
     
        const {success, error, data} = schema.safeParse(params)

        if (!success){
            return badRequest({errors: error.issues})
        }

        const meal = await db.query.mealsTable.findMany({
            columns: {
                id: true,
                foods: true,
                createdAt: true,
                icon: true,
                name: true,
                status: true,
            },
            where: and( 
           
                eq(mealsTable.id, data.mealId),
                eq(mealsTable.userId, userId),
        
            ),
        })
       
        return ok({meal})
    }
}