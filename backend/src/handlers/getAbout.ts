const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event: any) => {
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
    const data = await docClient.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item || {}), // Returnera "about"-data som JSON
    };
  } catch (error) {
    console.error('Error fetching about data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch about data' }),
    };
  }
};
