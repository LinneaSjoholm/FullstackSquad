import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  const apiKey = event.headers?.['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'ContactTable',
    Key: { id: 'contact' },
  };

  try {
    const data = await docClient.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item || {}),
    };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch contact data' }),
    };
  }
};