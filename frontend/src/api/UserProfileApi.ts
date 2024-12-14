import { getUserToken } from '../utils/authUser';


export const fetchUserProfile = async (userId: string): Promise<any> => {
  try {
    const token = getUserToken();

    if (!token) {
      throw new Error('No user token found. Please log in.');
    }

    const response = await fetch(`https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/user/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user profile.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
