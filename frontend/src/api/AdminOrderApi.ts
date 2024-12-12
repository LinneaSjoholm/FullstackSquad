import { getAdminToken } from '../utils/auth';

export const adminGetOrders = async (): Promise<any> => {
  
  try {
    const token = getAdminToken();  // Get the admin token from localStorage
    
    if (!token) {
      throw new Error('No admin token found. Please log in.');
    }

    const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

export const updateOrder = async (orderId: string, newStatus: string, commentToChef: string, locked: boolean) => {
  try {
    const token = getAdminToken();  // Get the admin token from localStorage
    
    if (!token) {
      throw new Error('No admin token found. Please log in.');
    }

    const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/order/update/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
      },
      body: JSON.stringify({
        status: newStatus,
        messageToChef: commentToChef,
        locked: locked, // Lägger till locked här
      }),
    });

    // Kontrollera om svaret är OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update order.');
    }

    const data = await response.json();

    // Kontrollera om uppdaterad order finns i svaret
    if (data.updatedOrder) {
      return data.updatedOrder; 
    } else {
      throw new Error('Unexpected response format: No updatedOrder found.');
    }

  } catch (error) {
    throw error; 
  }
};


export const lockOrder = async (orderId: string) => {
  try {

    const token = getAdminToken();  // Get the admin token from localStorage
    
    if (!token) {
      throw new Error('No admin token found. Please log in.');
    }

    const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/order/lock/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

export const markOrderAsComplete = async (orderId: string) => {
  try {
    const token = getAdminToken();  // Get the admin token from localStorage
    
    if (!token) {
      throw new Error('No admin token found. Please log in.');
    }

    const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/order/complete/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
      },
      body: JSON.stringify({
        status: 'completed',  
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark order as completed.');
    }

    const data = await response.json();

    if (data.updatedOrder) {
      return data.updatedOrder;
    } else {
      throw new Error('Unexpected response format: No updatedOrder found.');
    }
  } catch (error) {
    console.error('Error marking order as completed:', error);
    throw error;
  }
};

  