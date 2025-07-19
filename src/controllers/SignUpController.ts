import { HttpRequest, HttpResponse } from "../types/http";
import { ok } from "../utils/http";

export class SignUpController {
    static async handle(request: HttpRequest): Promise<HttpResponse>{
        return ok({ accessToken: 'signup: token de acesso'})
    }
}