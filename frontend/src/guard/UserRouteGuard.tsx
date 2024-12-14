import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserToken } from '../utils/authUser';  // Importera den funktion som hämtar token

interface UserRouteGuardProps {
  children: ReactNode;  // Definierar att komponenten accepterar `children`
}

const UserRouteGuard: React.FC<UserRouteGuardProps> = ({ children }) => {
  // Hämta token från localStorage
  const token = getUserToken();

  // Om det inte finns någon token, skicka användaren till login-sidan
  if (!token) {
    return <Navigate to="/user/login" />;
  }

  // Här kan du eventuellt lägga till en ytterligare kontroll för att verifiera tokenets giltighet.
  // Om du vill, kan du använda en funktion för att dekoda JWT och kontrollera om den är giltig.

  return <>{children}</>;  // Om token finns, rendera barnkomponenterna
};

export { UserRouteGuard };
