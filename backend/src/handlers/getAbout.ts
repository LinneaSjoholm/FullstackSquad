import { db } from '../services/db';

export const handler = async (event: any) => {
  const apiKey = event.headers?.['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'AboutTable',
    Key: { id: 'about' },
  };

  try {
    const data = await db.get(params);
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item || {}),
    };
  } catch (error) {
    console.error('Error fetching about data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch about data' }),
    };
  }
};
