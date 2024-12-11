import { v4 as uuidv4 } from "uuid"; // För att generera unika ID:n
import bcrypt from "bcryptjs"; // För att hasha lösenord
import { db } from "../services/db"; // För att interagera med databasen

export const handler = async (event: any) => {
  try {
    // Parsear body från request
    const { email, name, password, address, phone } = JSON.parse(event.body);

    // Validerar att alla fält finns
    if (!email|| !name||  !password||  !address||  !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    // Hashar lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Loggar det hashade lösenordet

    // Skapar en användare med ett unikt UUID (för intern användning)
    const user = {
      userId: uuidv4(), // Skapar ett unikt UUID för användaren (ändrat till userId)
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
      body: JSON.stringify({ message: "User created successfully", userId: user.userId }), // Ändrat till userId
    };
  } catch (error: any) {
    // Hanterar eventuella fel
    console.error("Error occurred:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};