import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
// Skapa DynamoDB-klienten
const client = new DynamoDB({
    region: process.env.AWS_REGION,
});
const db = DynamoDBDocument.from(client);
const docClient = DynamoDBDocument.from(client);
export { db, docClient };
