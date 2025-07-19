import { HttpRequest, HttpResponse } from "../types/http";
import { created } from "../utils/http";

export class SignInController {
    static async handle(request: HttpRequest): Promise<HttpResponse>{
        return created({ accessToken: 'token de acesso'})
    }
}