import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../services/db"; // För att interagera med databasen

interface User {
  userId: string;
  email: string;
  name: string;
  password: string;
}

const isUser = (item: any): item is User => {
  return item && typeof item.userId === 'string' && typeof item.email === 'string' && typeof item.name === 'string' && typeof item.password === 'string';
}

export const handler = async (event: any) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Email and password are required" }),
      };
    }

    // Skanna tabellen efter användare med rätt email
    const result = await db.scan({
      TableName: process.env.USERS_TABLE,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": email.trim(),
      },
    });

    const user = result.Items && result.Items[0];

    if (!user || !isUser(user)) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    // Jämför lösenord
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    // Generera JWT-token
    const token = jwt.sign(
      { userId: user.userId, email: user.email }, // Justerat till userId istället för id
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
        token,
        userId: user.userId,
      }),
    };
  } catch (error: any) {
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
