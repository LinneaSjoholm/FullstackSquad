import { db } from '../services/db'; // Importera db från din db-modul

// API-nyckeln (kan hämtas från miljövariabler för att vara mer säker)
const API_KEY = process.env.API_KEY || 'your-default-api-key';

// Definiera typerna för order och item
interface Item {
  id: string;
  quantity: number;
  name: string;
  price: number;
  ingredients: string[];
}

interface OrderDetails {
  customerName: string;
  customerPhone: string;
  items: Item[];
}

export const postOrder = async (event: any) => {
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

  let orderDetails: OrderDetails;
  try {
    // Försök att parsa JSON-begäran
    orderDetails = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON format' }),
    };
  }

  const { customerName, customerPhone, items } = orderDetails;

  // Kontrollera att alla nödvändiga data finns
  if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid order details. Ensure customerName, customerPhone, and items are provided.' }),
    };
  }

  // Skapa ett numeriskt order-ID (kombinerar tidsstämpel och ett slumpmässigt tal)
  const numericOrderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const itemMap: { [key: string]: Item } = {};
  items.forEach(item => {
    if (itemMap[item.id]) {
      itemMap[item.id].quantity += item.quantity; // Lägg till kvantiteter för samma artikel
    } else {
      itemMap[item.id] = { ...item }; // Lägg till artikeln om den inte finns
    }
  });

  const finalItems = Object.values(itemMap);

  const order = {
    orderId: numericOrderId,
    customerName,
    customerPhone,
    items: finalItems,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: 'OrdersTable',
    Item: order,
  };

  try {
    // Försök att lägga till beställningen i DynamoDB
    await db.put(params); // Använd db.put istället för dynamoDb.put

    // Returnera svaret med det skapade order-ID samt kundens detaljer
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Order created successfully',
        orderId: numericOrderId,
        customerName,
        customerPhone,
        items: finalItems,
      }),
    };
  } catch (error) {
    // Hantera fel vid läggning i databasen
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating order', error }),
    };
  }
};
