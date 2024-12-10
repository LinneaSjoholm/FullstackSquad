import { v4 as uuidv4 } from "uuid"; // För att generera unika ID:n
import bcrypt from "bcryptjs"; // För att hasha lösenord
import { db } from "../services/db"; // Ändrat till att importera db

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    // Parsear body från request
    const { email, name, password, address, phone } = JSON.parse(event.body);

    // Validerar att alla fält finns
    if (!email || !name || !password || !address || !phone) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Tillåt alla origin
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "POST, OPTIONS", // Tillåt POST och OPTIONS
        },
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    // Hashar lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Loggar det hashade lösenordet

    // Skapar en användare
    const user = {
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
      address,
      phone,
    };

    console.log("User object to save:", user); // Loggar användarobjektet innan det sparas

    // Lägger till användaren i DynamoDB
    await db.put({
      TableName: process.env.USERS_TABLE, // Tabellnamnet från serverless.yml
      Item: user,
    });

    // Returnerar framgångsrespons
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*", // Tillåt alla origin
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Tillåt POST och OPTIONS
      },
      body: JSON.stringify({ message: "User created successfully", userId: user.id }),
    };
  } catch (error: any) {
    // Hanterar eventuella fel
    console.error("Error occurred:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Tillåt alla origin
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Tillåt POST och OPTIONS
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};