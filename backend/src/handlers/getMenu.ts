import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDb = new DocumentClient();

// Definiera en typ för alla fält som vi får från DynamoDB
interface DynamoDBItem {
  id: string;
  name: string;
  price: number;
  popularity: number;
  lactoseFree: boolean;
  glutenFree: boolean;
  category: string;
  ingredients: string[];
  description: string;
}

// Definiera en typ för varje menyobjekt som vi skickar till användaren
interface MenuItem {
  name: string;
  price: number;
  ingredients: string[];
  lactoseFree: boolean;
  glutenFree: boolean;
  popularity: number;
}

export const getMenu = async (event: any) => {
  // Hämta API-nyckeln från event.headers
  const apiKey = event.headers['x-api-key'];

  // Kontrollera om API-nyckeln matchar den som finns i miljövariablerna
  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'MenuTable',
  };

  try {
    // Hämtar alla menyalternativ från DynamoDB
    const result = await dynamoDb.scan(params).promise();

    // Om det inte finns några rätter, returnera ett meddelande
    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No menu items found' }),
      };
    }

    // Gruppindelning av menyn
    const menuGroupedByCategory = result.Items.reduce((acc, item) => {
      // Typa objektet som DynamoDBItem för att ha tillgång till alla fält
      const dbItem = item as DynamoDBItem;

      // Hämta kategori och andra onödiga fält för att rensa bort dem senare
      const { category, id, description, ...filteredItem } = dbItem;

      // Om kategorin inte finns, använd "Others"
      const itemCategory = category || "Others";

      // Rensa och omorganisera fältens ordning
      const reorderedItem: MenuItem = {
        name: filteredItem.name,
        price: filteredItem.price,
        ingredients: filteredItem.ingredients,
        lactoseFree: filteredItem.lactoseFree,
        glutenFree: filteredItem.glutenFree,
        popularity: filteredItem.popularity,
      };

      if (!acc[itemCategory]) {
        acc[itemCategory] = [];
      }

      // Lägg till det rensade och omorganiserade objektet till rätt kategori
      acc[itemCategory].push(reorderedItem);
      return acc;
    }, {} as { [key: string]: MenuItem[] });

    // Sortera rätterna efter popularitet inom varje kategori
    for (const category in menuGroupedByCategory) {
      menuGroupedByCategory[category] = menuGroupedByCategory[category].sort((a: MenuItem, b: MenuItem) => (b.popularity || 0) - (a.popularity || 0));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ menu: menuGroupedByCategory }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching menu', error }),
    };
  }
};
