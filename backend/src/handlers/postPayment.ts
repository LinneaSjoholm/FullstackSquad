import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDB({ region: "eu-north-1" });

export const handler: APIGatewayProxyHandler = async (event) => {
  // Logga inkommande headers och body för debugging
  console.log("Incoming Headers:", event.headers);
  console.log("Incoming Body:", event.body);

  try {
    const { userId, orderId, paymentMethod, amount, cardDetails } = JSON.parse(event.body || "{}");

    // Validera payload
    if (!orderId || !paymentMethod || !amount) {
      console.log("Validation error: Missing required fields");
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Tillåt alla origin
          "Access-Control-Allow-Headers": "Content-Type", // Tillåt vissa headers
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Generera ett unikt betalnings-ID
    const paymentId = uuidv4();

    // Spara betalningen i DynamoDB
    await dbClient.putItem({
      TableName: "Payments",
      Item: {
        paymentId: { S: paymentId },
        orderId: { S: orderId },
        paymentMethod: { S: paymentMethod },
        amount: { N: amount.toString() },
        userId: { S: userId || `guest-${uuidv4()}` },
        isGuest: { BOOL: !userId },
      },
    });

    // Logga framgångsrik insättning
    console.log("Payment saved successfully:", {
      paymentId,
      orderId,
      paymentMethod,
      amount,
      userId: userId || `guest-${uuidv4()}`,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Tillåt alla origin
        "Access-Control-Allow-Headers": "Content-Type", // Tillåt vissa headers
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        message: "Payment saved successfully",
        paymentId,
        orderId,
        paymentMethod,
        amount,
        userId: userId || `guest-${uuidv4()}`,
        isGuest: !userId,
      }),
    };
  } catch (error: any) {
    console.error("Error during payment processing:", error.message);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Tillåt alla origin
        "Access-Control-Allow-Headers": "Content-Type", // Tillåt vissa headers
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};