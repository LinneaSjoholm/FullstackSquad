import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../services/db"; // För att interagera med databasen

export const handler = async (event: any) => {
  try {
    const { email, password } = JSON.parse(event.body);

    console.log("Email received:", email);
    console.log("Password received:", password);

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

    console.log("Using table:", process.env.USERS_TABLE);

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

    if (!user) {
      console.log("User not found");
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    console.log("Found user:", user);

    // Kontrollera om lösenordet är hashat
    if (!user.password.startsWith("$2a$10$")) {
      console.log("Password is not hashed, hashing now...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Uppdatera lösenordet i databasen
      await db.update({
        TableName: process.env.USERS_TABLE,
        Key: { userId: user.userId }, // Korrigera till användning av userId som primärnyckel
        UpdateExpression: "set #password = :password",
        ExpressionAttributeNames: {
          "#password": "password",
        },
        ExpressionAttributeValues: {
          ":password": hashedPassword,
        },
      });

      user.password = hashedPassword;
    }

    const plainPassword = password; // Lösenordet från användarens inmatning
    const hashedPassword = user.password; // Det hashade lösenordet från databasen

    console.log("Plain password:", plainPassword);
    console.log("Hashed password from DB:", hashedPassword);

    const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
    console.log("Do passwords match?", isMatch);

    if (!isMatch) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
        },
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    // Generera JWT-token
    const token = jwt.sign(
      { userId: user.userId, email: user.email }, // Justerat till userId istället för id
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1h" }
    );

    console.log("Generated token:", token);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
      },
      body: JSON.stringify({
        message: "Login successful!",
        name: user.name,
        token,
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