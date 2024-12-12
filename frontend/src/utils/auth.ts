// auth.ts

// Spara token i localStorage
export const saveAdminToken = (token: string) => {
    localStorage.setItem("adminToken", token);
  };
  
  // Hämta token från localStorage
  export const getAdminToken = (): string | null => {
    return localStorage.getItem("adminToken");
  };
  
  // Ta bort token från localStorage
  export const removeAdminToken = () => {
    localStorage.removeItem("adminToken");
  };
  