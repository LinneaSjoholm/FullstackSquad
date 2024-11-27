const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.getMenu = async (event) => {
  // Kontrollera API-nyckeln från request headers
  const apiKey = event.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'MenuTable',  // Se till att tabellnamnet är korrekt
  };

  try {
    // Hämta data från DynamoDB
    const data = await docClient.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),  // Returnera menyn som JSON
    };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch menu' }),
    };
  }
};
