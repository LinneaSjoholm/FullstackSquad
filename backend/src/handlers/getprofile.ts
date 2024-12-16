import { db } from "../services/db";
import jwt from "jsonwebtoken";
import { getFavorites } from "../services/favoriteService";


export const getProfile = async (event: any) => {
  try {
    // Extrahera JWT-token från Authorization headern
    const token = event.headers['authorization']?.split(" ")[1] || event.headers['Authorization']?.split(" ")[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized: Token is missing" }),
      };
    }

    // Verifiera token och få userId
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");
    const userId = decoded.userId;

    // Hämta användardata från UsersTable
    const userResult = await db.get({
      TableName: process.env.USERS_TABLE!,
      Key: { userId },
    });

    if (!userResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    // Hämta orderhistorik
    const ordersResult = await db.query({
      TableName: "OrdersTable",
      IndexName: "UserIdIndex", // Om du har skapat en secondary index för userId
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    // Hämta favoriter genom att anropa getFavorites
    const favorites = await getFavorites(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: userResult.Item,
        orders: ordersResult.Items,
        favorites: favorites, // Lägg till favoriter här
      }),
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching profile" }),
    };
  }
};