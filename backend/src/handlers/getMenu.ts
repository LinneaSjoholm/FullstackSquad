import { db } from '../services/db'; 

export const getMenu = async (event: any): Promise<any> => {
  // Logga API-nyckeln för att säkerställa att den tas emot korrekt
  console.log('API_KEY in environment:', process.env.API_KEY);

  // Hämta API-nyckeln från request headers
  const apiKey = event.headers['x-api-key'];
  console.log('Received API key:', apiKey);

  // Kontrollera om API-nyckeln är korrekt
  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  // Parametrar för att hämta data från DynamoDB
  const params = {
    TableName: 'MenuTable',
  };

  try {
    // Hämta data från DynamoDB
    const data = await db.scan(params);

    // Kontrollera om Items existerar och är en array
    if (!data.Items || !Array.isArray(data.Items)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No items found in the menu.' }),
      };
    }

    // Sortera menyn baserat på 'id'
    const sortedItems = data.Items.sort((a: any, b: any) => {
      // Konvertera 'id' till nummer och sortera
      return Number(a.id.S) - Number(b.id.S);
    });

    // Skicka tillbaka den sorterade listan som JSON
    return {
      statusCode: 200,
      body: JSON.stringify(sortedItems),
    };
  } catch (error: any) {
    // Logga fel och skicka ett internt serverfel
    console.error('Error fetching menu:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch menu', error: error.message }),
    };
  }
};
