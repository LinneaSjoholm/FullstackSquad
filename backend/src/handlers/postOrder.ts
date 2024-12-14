import { db } from "../services/db";
import jwt from "jsonwebtoken";

const API_KEY = process.env.API_KEY || "your-default-api-key";

// Funktion för att beräkna totalpriset
const calculateTotalPrice = (items: any[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = item.price || 0; 
    return total + (item.quantity * itemPrice); 
  }, 0);
};

export const postOrder = async (event: any) => {
  console.log("Event received:", event); 
  const apiKey = event.headers['x-api-key'];
  
  

  // Kontrollera om API-nyckel saknas
  if (!apiKey) {
    console.error("Missing API key");
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: "Missing API key" }),
    };
  }

  // Kontrollera om API-nyckeln är korrekt
  if (apiKey !== process.env.API_KEY) {
    console.error("Forbidden: Invalid API key");
    return {
      statusCode: 403, // Forbidden
      body: JSON.stringify({ message: "Forbidden: Invalid API key" }),
    };
  }

  let orderDetails;
  try {
    orderDetails = JSON.parse(event.body); 
  } catch (error) {
    console.error("Invalid JSON format:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }

  const { customerName, customerPhone, items } = orderDetails;

  // Kontrollera om nödvändiga orderdetaljer saknas
  if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
    console.error("Invalid order details");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid order details" }),
    };
  }

  // Verifiera JWT-token om användaren är inloggad
  let loggedInUserId = "guest"; 
  let loggedInRole = "guest"; 

  if (event.headers.Authorization) {
    try {
      console.log("Authorization header provided:", event.headers.Authorization);

      // Extrahera token från Authorization headern
      const token = event.headers.Authorization.split(" ")[1];
      if (!token) {
        console.error("Invalid Authorization header format");
        throw new Error("Token missing in Authorization header");
      }

      // Dekoda och verifiera tokenen
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");
      console.log("Decoded token:", decoded);

      // Extrahera userId och role från token
      loggedInUserId = decoded.userId || "guest";
      loggedInRole = decoded.role || "guest";

      if (!loggedInUserId || !loggedInRole) {
        console.error("Invalid token payload:", decoded);
        throw new Error("Missing userId or role in token");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Token verification error:", error.message);
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Unauthorized: Invalid token", error: error.message }),
        };
      } else {
        console.error("Unknown token verification error:", error);
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Unauthorized: Unknown token error" }),
        };
      }
    }
  } else {
    console.log("No Authorization header provided. Defaulting to guest.");
  }

  // Beräkna totalpriset för ordern
  const totalPrice = calculateTotalPrice(items);

  // Skapa orderobjekt
  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`; 
  const order = {
    orderId,
    customerName,
    customerPhone,
    items,
    totalPrice,
    userId: loggedInUserId, 
    role: loggedInRole, 
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: "OrdersTable",
    Item: order,
  };

  try {
    // Spara ordern i databasen
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
        userId: loggedInUserId, 
        role: loggedInRole, 
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating order:", error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error creating order", error: error.message }),
      };
    } else {
      console.error("Unknown error creating order:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error creating order", error: "Unknown error" }),
      };
    }
  }
};

