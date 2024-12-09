var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { docClient } from "../services/db";
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield docClient.scan({
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
            const hashedPassword = yield bcrypt.hash(password, 10);
            // Uppdatera lösenordet i databasen
            yield docClient.update({
                TableName: process.env.USERS_TABLE,
                Key: { id: user.id },
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
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                body: JSON.stringify({ error: "Invalid credentials" }),
            };
        }
        // Generera JWT-token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: "1h" });
        console.log("Generated token:", token);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({
                message: "Login successful!",
                name: user.name,
                token,
            }),
        };
    }
    catch (error) {
        console.error("Error occurred:", error.message);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
});
