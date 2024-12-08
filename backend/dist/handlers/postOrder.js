var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const dynamoDb = new DocumentClient();
// API-nyckeln (kan hämtas från miljövariabler för att vara mer säker)
const API_KEY = process.env.API_KEY || 'your-default-api-key';
export const postOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    // Kontrollera om API-nyckeln finns i begäran
    const apiKey = event.headers['x-api-key'];
    if (!apiKey || apiKey !== API_KEY) {
        return {
            statusCode: 403, // Forbidden om nyckeln inte är rätt
            body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
        };
    }
    // Kontrollera om det finns en body i begäran
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request body is missing' }),
        };
    }
    let orderDetails;
    try {
        // Försök att parsa JSON-begäran
        orderDetails = JSON.parse(event.body);
    }
    catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON format' }),
        };
    }
    const { customerName, customerPhone, items } = orderDetails;
    // Kontrollera att alla nödvändiga data finns
    if (!customerName || !Array.isArray(items) || items.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid order details. Ensure customerName, customerPhone, and items are provided.' }),
        };
    }
    // Skapa ett numeriskt order-ID (kombinerar tidsstämpel och ett slumpmässigt tal)
    const numericOrderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const order = {
        orderId: numericOrderId,
        customerName,
        customerPhone, // Lägg till telefonnummer i beställningen
        items, // Rätt objektsstruktur som skickas från frontend
        status: 'pending', // Status kan vara "pending", "processed", etc.
        createdAt: new Date().toISOString(), // Tidpunkt för beställning
    };
    const params = {
        TableName: 'OrdersTable',
        Item: order, // Lägger till beställningen i DynamoDB
    };
    try {
        // Försök att lägga till beställningen i DynamoDB
        yield dynamoDb.put(params).promise();
        // Returnera svaret med det skapade order-ID samt kundens detaljer
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Order created successfully',
                orderId: numericOrderId,
                customerName,
                customerPhone,
                items,
            }),
        };
    }
    catch (error) {
        // Hantera fel vid läggning i databasen
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating order', error }),
        };
    }
});
