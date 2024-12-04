import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDB({ region: "eu-north-1" });

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { userId, orderId, paymentMethod, amount, cardDetails } = JSON.parse(event.body || "{}");

    // Validera payload
    if (!userId || !orderId || !paymentMethod || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    if (paymentMethod === "card" && !cardDetails) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Card details required for card payment" }),
      };
    }

    const paymentId = uuidv4();

    // Spara betalningen i DynamoDB (mock för nu)
    await dbClient.putItem({
      TableName: "Payments",
      Item: {
        paymentId: { S: paymentId },
        orderId: { S: orderId },
        paymentMethod: { S: paymentMethod },
        amount: { N: amount.toString() },
        paymentStatus: { S: "pending" },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Payment saved successfully",
        paymentId,
        orderId,
        paymentMethod,
        amount,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};