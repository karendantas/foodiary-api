import { eq } from "drizzle-orm";
import { db } from "../db";
import { HttpResponse, ProtectedHttpRequest } from "../types/http";
import { badRequest, ok } from "../utils/http";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import z, { safeParse } from 'zod'
import { mealsTable } from "../db/schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { s3Client } from "../clients/s3Client";

const schema = z.object({
    fileType: z.enum(['audio/m4a', 'image/jpeg'])
})
export class CreateMealController {
    static async handle({userId, body}: ProtectedHttpRequest): Promise<HttpResponse>{
        
        const {success, error, data} = schema.safeParse(body)

        if (!success){
            return badRequest({errors: error.issues})
        }

        const fileId = randomUUID()
        const ext = data.fileType === 'audio/m4a' ? '.m4a' : '.jpg'
        const fileKey = `${fileId}${ext}`

        const command = new PutObjectCommand({
            Bucket:'jstacklab-v1-foodiary-uploads-karendev',
            Key: fileKey,
        })

        const presignedUrl = await getSignedUrl(s3Client, command, {expiresIn: 600})

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
            mealId: meal.id,
            uploadUrl: presignedUrl
        })
    }
}