
export const adminGetOrders = async (): Promise<any> => {
  
  try {
    const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
      },
    });

    const data = await response.json();

    if (!response.ok) {
  
      throw new Error(data.message || 'Failed to fetch orders.');
    }

    return { statusCode: 200, body: data };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      statusCode: 500,
      body: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

export const updateOrder = async (orderId: string, newStatus: string, commentToChef: string) => {
  try {
    const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/order/${orderId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
      },
      body: JSON.stringify({
        status: newStatus,
        messageToChef: commentToChef,
      }),
    });

    console.log('API response status:', response.status);

    // Kontrollera om svaret är OK
    if (!response.ok) {
      // Om statuskoden inte är OK, logga och kasta fel
      const errorData = await response.json();
      console.error('Error response from API:', errorData);
      throw new Error(errorData.message || 'Failed to update order.');
    }

    const data = await response.json();

    // Kontrollera om uppdaterad order finns i svaret
    if (data.updatedOrder) {
      console.log('Order updated successfully:', data.updatedOrder);
      return data.updatedOrder; // Return the updated order directly
    } else {
      throw new Error('Unexpected response format: No updatedOrder found.');
    }

  } catch (error) {
    // Logga det fångade felet för att få mer insikt
    console.error('Error updating order:', error);
    throw error; // Kasta vidare felet så att handleUpdateOrder kan fånga det
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
    
    return await response.json();
  } catch (error) {
    console.error('Error locking order:', error);
    throw error; 
  }
};

  