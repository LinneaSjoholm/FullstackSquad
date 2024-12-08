   // För att hämta alla orders
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
  
  // För att låsa en specifik order
  export const lockOrder = async (orderId: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://10zr48ki5e.execute-api.eu-north-1.amazonaws.com/dev/admin/order/${orderId}/lock`, 
        
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to lock order.');
      }
  
      alert('Order is locked successfully.');
    } catch (error) {
      console.error('Error locking order:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };
  