var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from "uuid"; // För att generera unika ID:n
import bcrypt from "bcryptjs"; // För att hasha lösenord
import { db } from "../services/db"; // Ändrat till att importera db
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parsear body från request
        const { email, name, password, address, phone } = JSON.parse(event.body);
        // Validerar att alla fält finns
        if (!email || !name || !password || !address || !phone) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "All fields are required" }),
            };
        }
        // Hashar lösenordet
        const hashedPassword = yield bcrypt.hash(password, 10);
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
        yield db.put({
            TableName: process.env.USERS_TABLE, // Tabellnamnet från serverless.yml
            Item: user,
        });
        // Returnerar framgångsrespons
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "User created successfully", userId: user.id }),
        };
    }
    catch (error) {
        // Hanterar eventuella fel
        console.error("Error occurred:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
});
