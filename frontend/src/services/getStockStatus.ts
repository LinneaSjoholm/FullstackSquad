const apiUrl = 'https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/stock-status';

export const getStockStatus = async (): Promise<any> => {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;  // Här får du tillbaka menyn med lagerstatus
  } catch (error) {
    console.error('Error fetching stock status:', error);
    throw error;  // Återkastar felet för att hantera det i andra delar av applikationen
  }
};
