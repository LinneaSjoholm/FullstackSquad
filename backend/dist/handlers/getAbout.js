var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const apiKey = (_a = event.headers) === null || _a === void 0 ? void 0 : _a['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
        };
    }
    const params = {
        TableName: 'AboutTable',
        Key: { id: 'about' },
    };
    try {
        const data = yield docClient.get(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item || {}),
        };
    }
    catch (error) {
        console.error('Error fetching about data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to fetch about data' }),
        };
    }
});
