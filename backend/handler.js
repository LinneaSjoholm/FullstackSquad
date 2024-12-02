const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

// Funktion för att hämta menyn
module.exports.getMenu = async (event) => {
  const apiKey = event.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'MenuTable', // Se till att tabellnamnet är korrekt
  };

  try {
    const data = await docClient.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items), // Returnera menyn som JSON
    };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch menu' }),
    };
  }
};

// Funktion för att hämta "About"-data
module.exports.getAbout = async (event) => {
  const apiKey = event.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'AboutTable', // Se till att tabellnamnet är korrekt
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

// Funktion för att hämta "Confirmation"-data
module.exports.getConfirmation = async (event) => {
  const apiKey = event.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'ConfirmationTable', // Se till att tabellnamnet är korrekt
    Key: { id: 'confirmation' },
  };

  try {
    const data = await docClient.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item || {}), // Returnera "confirmation"-data som JSON
    };
  } catch (error) {
    console.error('Error fetching confirmation data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch confirmation data' }),
    };
  }
};

// Funktion för att hämta "Contact"-data
module.exports.getContact = async (event) => {
  const apiKey = event.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'ContactTable', // Se till att tabellnamnet är korrekt
    Key: { id: 'contact' },
  };

  try {
    const data = await docClient.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item || {}), // Returnera "contact"-data som JSON
    };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch contact data' }),
    };
  }
};
