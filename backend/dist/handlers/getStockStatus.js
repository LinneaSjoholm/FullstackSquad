var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/handlers/getStockStatus.ts
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDB({
    region: process.env.AWS_REGION,
});
const db = DynamoDBDocument.from(client);
export const getStockStatus = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: 'IngredientsTable',
    };
    try {
        const result = yield db.scan(params);
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
    }
    catch (error) {
        console.error('Error fetching stock status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching stock status' }),
        };
    }
});
