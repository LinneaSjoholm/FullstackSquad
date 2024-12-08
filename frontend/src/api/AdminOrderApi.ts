
   export const adminGetOrders = async (): Promise<any> => {
    try {
      const response = await fetch('https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/orders'); 
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders.');
      }
  
      return { statusCode: 200, body: data }; 
    } catch (error) {
      return { statusCode: 500, body: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  };
  

export const lockOrder = async (orderId: string) => {
  const apiUrl = `https://j9vnr3bolg.execute-api.eu-north-1.amazonaws.com/dev/admin/order/${orderId}/lock`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to lock order');
    }
    
    return await response.json(); // Om API:et är framgångsrikt, returnera JSON svaret
  } catch (error) {
    console.error('Error locking order:', error);
    throw error; // Kasta felet vidare så att det kan hanteras i frontend
  }
};

  