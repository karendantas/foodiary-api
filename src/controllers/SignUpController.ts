import { eq } from "drizzle-orm/sql";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, conflict, created } from "../utils/http";
import {hash} from 'bcryptjs'
import z from 'zod'

const schema = z.object({
    goal: z.enum(['lose', 'maintain', 'gain']),
    gender: z.enum(['female', 'male']),
    birthDate: z.iso.date(),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.number().min(1).max(5),
    account: z.object({
        name: z.string().min(1),
        email: z.email(),
        password: z.string().min(8),
    })
})

export class SignUpController {
    static async handle({body}: HttpRequest): Promise<HttpResponse>{

        const { success, error,data } = schema.safeParse(body)

        if (!success) {
            return badRequest({erros: error.issues})
        }

        const userAlreadyExists = await db.query.usersTable.findFirst({
            columns: {
                email: true
            },
            where: eq(usersTable.email, data.account.email)
        })

        if (userAlreadyExists){
            return conflict({error: 'This email is already in use'})
        }

        const hashPassword = await hash(data.account.password, 8)
        const [user] = await db.insert(usersTable).values({
            ...data,
            ...data.account,
            password: hashPassword,
            calories: 0,
            fats: 0,
            proteins: 0,
            carbohydrates: 0,
        }).returning({
            id: usersTable.id
        })

        return created({
            userId: user.id
        })
    }
}