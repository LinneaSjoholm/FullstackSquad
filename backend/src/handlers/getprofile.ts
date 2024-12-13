import { APIGatewayProxyHandler } from "aws-lambda";
import { db } from "../services/db"; // För DynamoDB
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const getProfile: APIGatewayProxyHandler = async (event) => {
  const token = event.headers["Authorization"]?.split("Bearer ")[1];

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "No token provided" }),
    };
  }

  try {
    // Verifiera token
    let decodedToken: JwtPayload | string;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");

      if (typeof decodedToken !== 'string') {
        const userId = decodedToken.userId;

        // Hämta användarens data från UsersTable
        const result = await db.get({
          TableName: process.env.USERS_TABLE || "UsersTable",
          Key: { userId },
        });

        if (!result.Item) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: "User not found" }),
          };
        }

        const user = result.Item;

        // Skicka tillbaka användarens profilinformation
        return {
          statusCode: 200,
          body: JSON.stringify({
            userName: user.name,
            email: user.email, // You can add more fields if needed
            favorites: user.favorites || [],
            orderHistory: user.orderHistory || [],
          }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid token format" }),
        };
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Token has expired" }),
        };
      } else if (error instanceof JsonWebTokenError) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid token" }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Internal server error" }),
        };
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }
};
