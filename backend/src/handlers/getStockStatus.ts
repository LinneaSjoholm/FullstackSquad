// src/handlers/getStockStatus.ts
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDB({
  region: process.env.AWS_REGION,
});
const db = DynamoDBDocument.from(client);

export const getStockStatus = async (event: any): Promise<any> => {
  const params = {
    TableName: 'IngredientsTable',
  };

  try {
    const result = await db.scan(params);

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No ingredients found' }),
      };
    }

    const filteredItems = result.Items.filter(item => {
      return item.dishNames && item.dishNames.length > 0;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(filteredItems),
    };
  } catch (error) {
    console.error('Error fetching stock status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching stock status' }),
    };
  }
};
