import { db } from "../services/db"; 
import jwt from "jsonwebtoken"; 

const API_KEY = process.env.API_KEY || "your-default-api-key";

export const postOrder = async (event: any) => {
  const apiKey = event.headers['x-api-key'];

  if (!apiKey) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: 'Missing API key' }),
    };
  }

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403, // Forbidden
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

  const { customerName, customerPhone, items, totalPrice, userId } = orderDetails;

  if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid order details" }),
    };
  }

  // Verifiera JWT-token om användaren är inloggad
  let loggedInUserId = userId || null;

  if (event.headers.Authorization) {
    try {
      // Extrahera token från Authorization headern
      const token = event.headers.Authorization.split(" ")[1];

      // Dekoda och verifiera tokenen
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");

      // Extrahera userId från token och tilldela det till loggedInUserId
      loggedInUserId = decoded.userId || "guest";  // Default to "guest" if not present in token
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized: Invalid token" }),
      };
    }
  }

  const userIdToSave = loggedInUserId || "guest"; // Sätt till "guest" om ej inloggad

  // Skapa orderobjekt
  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const order = {
    orderId,
    customerName,
    customerPhone,
    items,
    totalPrice,
    userId: userIdToSave, // Lägg till userId
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
        totalPrice,
        userId: userIdToSave,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating order", error }),
    };
  }
};
