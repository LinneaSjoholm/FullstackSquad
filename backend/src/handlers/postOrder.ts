import { db } from "../services/db"; // Importera db
import jwt from "jsonwebtoken"; // För att hantera JWT-token

const API_KEY = process.env.API_KEY || "your-default-api-key";

export const postOrder = async (event: any) => {
  // Kontrollera om API-nyckeln finns i begäran (kan tas bort för att göra API:et öppet)
  const apiKey = event.headers['x-api-key'];
  if (!apiKey) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: 'Missing API key' }),
    };
  }

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403, // Forbidden om nyckeln inte är rätt
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  let orderDetails;
  try {
    orderDetails = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }

  const { customerName, customerPhone, items, userId } = orderDetails;

  if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid order details" }),
    };
  }

  // Verifiera JWT-token om användaren är inloggad
  let loggedInUserId = null;
  if (event.headers.Authorization) {
    try {
      const token = event.headers.Authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");
      loggedInUserId = decoded.id;
    } catch (error) {
      console.error("Invalid token:", error);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized: Invalid token" }),
      };
    }
  }

  // Skapa orderobjekt
  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const order = {
    orderId,
    customerName,
    customerPhone,
    items,
    userId: loggedInUserId || null, // Om ingen användare är inloggad, lämna userId som null
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: "OrdersTable",
    Item: order,
  };

  try {
    await db.put(params);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Order created successfully",
        orderId,
        customerName,
        customerPhone,
        items,
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating order", error }),
    };
  }
};

export const getOrders = async (event: any) => {
  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  try {
    const params = {
      TableName: 'OrdersTable',
      IndexName: 'UserIdIndex', // Skapa en GSI för userId om nödvändigt
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const result = await db.query(params);

    return {
      statusCode: 200,
      body: JSON.stringify({ orders: result.Items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching orders', error }),
    };
  }
};