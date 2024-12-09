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
          "Access-Control-Allow-Origin": "*", // Tillåter alla domäner
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Admin ID and password are required" }),
      };
    }

    const adminCredentials = {
      adminID: "admin123",
      hashedPassword: "$2a$10$BvA4pLloApXNFeOF46Es5O6XYvqtw7bu7CNJaH6x4OZTrLOacaeYS",
    };

    if (adminID !== adminCredentials.adminID) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    const isPasswordValid = await bcrypt.compare(
      adminPassword,
      adminCredentials.hashedPassword
    );

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