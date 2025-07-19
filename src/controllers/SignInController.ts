import { eq } from "drizzle-orm/sql";
import { db } from "../db";
import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, ok, unauthorized } from "../utils/http";
import z from 'zod'
import { usersTable } from "../db/schema";
import { compare } from "bcryptjs";


const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export class SignInController {
    static async handle({body}: HttpRequest): Promise<HttpResponse>{

        const { success, error, data } = schema.safeParse(body)
               

        if (!success) {
            return badRequest({erros: error.issues})
        }

        const user = await db.query.usersTable.findFirst({
            columns: {
                id: true,
                email: true,
                password: true
            },
            where: eq(usersTable.email, data.email)
            })
        
        if (!user) {
            return unauthorized({error: 'Invalid user'})
        }

        const isPasswordValid = compare(data.password, user.password)

        if (!isPasswordValid){
            return unauthorized({error: 'Invalid credentials'})
        }
        return ok(user)
    }
}