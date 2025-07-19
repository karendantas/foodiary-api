import { eq } from "drizzle-orm";
import { db } from "../db";
import { HttpResponse, ProtectedHttpRequest } from "../types/http";
import { badRequest, ok } from "../utils/http";

import z, { safeParse } from 'zod'
import { mealsTable } from "../db/schema";

const schema = z.object({
    fileType: z.enum(['audio/m4a', 'image/jpeg'])
})
export class CreateMealController {
    static async handle({userId, body}: ProtectedHttpRequest): Promise<HttpResponse>{
        
        const {success, error, data} = schema.safeParse(body)

        if (!success){
            return badRequest({errors: error.issues})
        }
        const [meal] = await db.insert(mealsTable).values({
            inputFileKey: 'input_file_key',
            inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
            status: 'uploading',
            userId: userId,
            icon: '',
            foods: [],
            name: ''
        }).returning({id: mealsTable.id})

        return ok({
            mealId: meal.id
        })
    }
}