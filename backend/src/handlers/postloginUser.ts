import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../services/db";

interface User {
  userId: string;
  email: string;
  name: string;
  password: string;
  role: string;
}

export const handler = async (event: any) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        body: JSON.stringify({ error: "Email and password are required" }),
      };
    }

    const result = await db.send(new ScanCommand({
      TableName: process.env.USERS_TABLE!,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": email.trim(),
      },
    }));

    const user = result.Items && result.Items[0] as User;

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1h" }
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: JSON.stringify({
        message: "Login successful!",
        name: user.name,
        role: user.role,
        userId: user.userId,
        token,
      }),
    };
  } catch (error: any) {
    console.error("Error during login:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
