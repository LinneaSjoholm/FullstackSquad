import { db } from "../services/db"; // Import db
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"; // Import för Get och Put
import bcrypt from "bcryptjs"; // För att jämföra lösenord
import jwt from "jsonwebtoken"; // För att skapa JWT-token
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"; // AWS Lambda API för begäran och svar

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { adminID, adminPassword, isCreateAdmin } = JSON.parse(event.body || "{}");

    console.log("Received admin ID:", adminID);
    console.log("Received admin password:", adminPassword);

    // Kontrollera att adminID och adminPassword finns i begäran
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

    // Om vi försöker skapa en admin (isCreateAdmin är true)
    if (isCreateAdmin) {
      // Kontrollera om admin redan finns
      const command = new GetCommand({
        TableName: "AdminsTable",
        Key: { adminID },
      });

      const existingAdmin = await db.send(command);

      if (existingAdmin.Item) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: "Admin with this ID already exists" }),
        };
      }

      // Hasha lösenordet innan det sparas
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Lägg till den nya adminen i DynamoDB
      const putCommand = new PutCommand({
        TableName: "AdminsTable",
        Item: {
          adminID,
          hashedPassword,
        },
      });

      await db.send(putCommand);
      console.log("Admin created:", adminID);

      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ message: "Admin created successfully" }),
      };
    } else {
      // Annars försök att logga in som admin

      // Hämta admin-uppgifter från DynamoDB
      const command = new GetCommand({
        TableName: "AdminsTable",
        Key: { adminID },
      });

      const adminCredentials = await db.send(command);
      console.log("Fetched admin credentials:", adminCredentials);

      // Kontrollera om vi fick några resultat från DynamoDB
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

      // Hämta det hashade lösenordet från databasen
      const hashedPassword = adminCredentials.Item.hashedPassword;

      // Jämför det inmatade lösenordet med det hashade lösenordet
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

      // Om lösenordet är korrekt, skapa en JWT-token
      const token = jwt.sign(
        { adminID },
        process.env.JWT_SECRET || "defaultSecret", // Använd miljövariabeln för JWT hemligheten
        { expiresIn: "2h" }
      );

      // Skicka tillbaka svaret med JWT-token
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
    }
  } catch (error: any) {
    console.error("Error during admin process:", error.message);
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
