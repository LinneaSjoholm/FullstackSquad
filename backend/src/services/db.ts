import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

// Skapa DynamoDB-klienten
const client = new DynamoDB({
  region: process.env.AWS_REGION,  // Se till att du har rätt AWS-region definierad
});

// Skapa och exportera en instans av DynamoDBDocument
const db = DynamoDBDocument.from(client);

export { db };  // Exports for use in other filesw