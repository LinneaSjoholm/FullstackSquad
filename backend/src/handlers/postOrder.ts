import { db } from "../services/db";
import jwt from "jsonwebtoken";
import { saveFavorites } from "../services/favoriteService";

const API_KEY = process.env.API_KEY;

const validateApiKey = (apiKey: string): boolean => apiKey === API_KEY;

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

  // Kontrollera om API-nyckel saknas eller är ogiltig
  if (!apiKey || !validateApiKey(apiKey)) {
    console.error("Forbidden: Invalid or missing API key");
    return {
      statusCode: 403, // Forbidden
      body: JSON.stringify({ message: "Forbidden: Invalid or missing API key" }),
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

  if (event.headers['Authorization'] || event.headers['authorization']) {
    try {
      console.log("Authorization header provided:", event.headers['Authorization'] || event.headers['authorization']);
  
      // Kontrollera både 'Authorization' och 'authorization'
      const token = event.headers['Authorization']?.split(" ")[1] || event.headers['authorization']?.split(" ")[1];
      
      if (!token) {
        console.error("Invalid Authorization header format");
        throw new Error("Token missing in Authorization header");
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");
      console.log("Decoded token payload:", decoded);

      loggedInUserId = decoded.userId || "guest";
      loggedInRole = decoded.role || "guest";

      if (!loggedInUserId || !loggedInRole) {
        console.error("Invalid token payload:", decoded);
        throw new Error("Missing userId or role in token");
      }
    } catch (error) {
      console.error("Token verification error:", (error as Error).message);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized: Invalid token", error: (error as Error).message }),
      };
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

    // Kontrollera om användaren är inloggad (inte "guest") och spara favoriter

    if (loggedInRole !== "guest") {
      await saveFavorites(loggedInUserId, items); // Spara favoriter för inloggad användare
    } else {
      console.log("User is guest. Skipping saving favorite items.");
    }

    // Returnera framgångsmeddelande
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
    console.error("Error creating order:", (error as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating order", error: (error as Error).message }),
    };
  }
};