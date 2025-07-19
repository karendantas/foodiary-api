import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, ok } from "../utils/http";
import z from 'zod'

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
        
        return ok(data)
    }
}