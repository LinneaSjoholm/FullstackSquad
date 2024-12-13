

// Spara token i localStorage
export const saveUserToken = (token: string) => {
    localStorage.setItem("userToken", token);
  };
  
  // Hämta token från localStorage
  export const getUserToken = (): string | null => {
    return localStorage.getItem("userToken");
  };
  
  // Ta bort token från localStorage
  export const removeUserToken = () => {
    localStorage.removeItem("userToken");
  };
  