import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { db } from "../services/db";

export const handler = async (event: any) => {
  try {
    const { email, name, password, address, phone, role } = JSON.parse(event.body);

    if (!email || !name || !password || !address || !phone) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
        },
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    // Kontrollera om e-posten redan finns
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

    if (result.Items && result.Items.length > 0) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
        },
        body: JSON.stringify({ error: "Email is already in use" }), 
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Om ingen roll är angiven, sätt "user" som default
    const userRole = role || "user";  

    const user = {
      userId: uuidv4(),
      email,
      name,
      password: hashedPassword,
      address,
      phone,
      role: userRole,  
    };

    // Spara användaren i databasen
    await db.put({
      TableName: process.env.USERS_TABLE,
      Item: user,
    });

    // Skicka tillbaka användarens information (inklusive roll)
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
      },
      body: JSON.stringify({
        message: "User created successfully",
        userId: user.userId,
        role: userRole, 
      }),
    };
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
