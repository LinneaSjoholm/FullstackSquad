import { db } from "../services/db"; // Importerar db
import { GetCommand } from "@aws-sdk/lib-dynamodb"; // Importera GetCommand
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { adminID, adminPassword } = JSON.parse(event.body || "{}");

    console.log("Admin ID received:", adminID);
    console.log("Admin password received:", adminPassword);

    if (!adminID || !adminPassword) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Admin ID and password are required" }),
      };
    }

    // Använd db för att hämta admin-uppgifter
    const command = new GetCommand({
      TableName: "AdminsTable",
      Key: { adminID },
    });

    const adminCredentials = await db.send(command);

    if (!adminCredentials.Item) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    const hashedPassword = adminCredentials.Item.hashedPassword;

    const isPasswordValid = await bcrypt.compare(adminPassword, hashedPassword);

    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    const token = jwt.sign(
      { adminID },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "2h" }
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "Admin login successful!",
        token,
      }),
    };
  } catch (error: any) {
    console.error("Error during admin login:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};