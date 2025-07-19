import { S3Event } from "aws-lambda";

export async function handler(event: S3Event){
    await Promise.all(event.Records.map(record => {
        record.s3.object.key
    })) //chama a lambda quando tiver a key de um arquivo upado
}