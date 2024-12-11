export const logoutHandler = async (event: any) => {
    try {
      // För att logga ut en användare, behöver vi bara meddela klienten att utloggningen är klar
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Logout successful!" }),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  