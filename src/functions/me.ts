import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseResponse } from "../utils/parseResponde";
import { MeController } from "../controllers/MeController";
import { parseProtectedEvent } from "../utils/parseProtectedEvent";
import { unauthorized } from "../utils/http";

export async function handler (event: APIGatewayProxyEventV2) {
    try {
        const request = parseProtectedEvent(event)
        const response = await MeController.handle(request)
        return parseResponse(response)
    } catch (error) {
        return parseResponse(unauthorized({error: 'invalid credentials'}))
    }
 
}