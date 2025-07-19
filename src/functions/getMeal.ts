import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseResponse } from "../utils/parseResponde";
import { parseProtectedEvent } from "../utils/parseProtectedEvent";
import { unauthorized } from "../utils/http";
import { GetMealByIdController } from "../controllers/GetMealByIdController";

export async function handler (event: APIGatewayProxyEventV2) {
    try {
        const request = parseProtectedEvent(event)
        const response = await GetMealByIdController.handle(request)
        return parseResponse(response)
    } catch (error) {
        return parseResponse(unauthorized({error: 'invalid credentials'}))
    }
 
}