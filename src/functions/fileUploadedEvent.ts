import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { S3Event } from "aws-lambda";
import { sqsClient } from "../clients/sqsClient";

export async function handler(event: S3Event){
    await Promise.all(event.Records.map(async record => {
        const command = new SendMessageCommand({
            QueueUrl: 'meals-queue',
            MessageBody: JSON.stringify({fileKey: record.s3.object.key})
        })

        await sqsClient.send(command)
      
    })) //chama a lambda quando tiver a key de um arquivo upado e envia pra fila
}