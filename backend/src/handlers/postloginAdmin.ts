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

    // Kontrollera att adminID och adminPassword är inkluderade i förfrågan
    if (!adminID || !adminPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Admin ID and password are required" }),
      };
    }

    // Här definierar vi exempel på hårdkodade adminuppgifter
    const adminCredentials = {
      adminID: "admin123", // Admin-ID
      hashedPassword: "$2a$10$BvA4pLloApXNFeOF46Es5O6XYvqtw7bu7CNJaH6x4OZTrLOacaeYS", // Genererat hash för "adminpassword"
    };

    // Kontrollera om adminID matchar
    if (adminID !== adminCredentials.adminID) {
      console.log("Invalid admin ID");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    // Verifiera admin-lösenord
    const isPasswordValid = await bcrypt.compare(
      adminPassword,
      adminCredentials.hashedPassword
    );

    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    // Generera JWT-token för admin
    const token = jwt.sign(
      { adminID },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "2h" } // Token gäller i 2 timmar
    );

    console.log("Generated token for admin:", token);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Admin login successful!",
        token,
      }),
    };
  } catch (error: any) {
    console.error("Error during admin login:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};