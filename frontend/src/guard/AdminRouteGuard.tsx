import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAdminToken } from '../utils/auth';  // Antag att detta hämtar token från lokal lagring eller liknande

const AdminRouteGuard: React.FC = () => {
  const token = getAdminToken(); // Hämtar token

  if (!token) {
    // Om ingen token finns, omdirigera till inloggningssidan
    return <Navigate to="/admin/login" />;
  }

  try {
    // Verifiera token (antingen via jwt-dekodering eller backend-verifiering)
    const payload = JSON.parse(atob(token.split('.')[1])); // Dekodera JWT (endast för demonstration)
    if (payload.role !== 'admin') {
      // Om rollen inte är admin, neka åtkomst
      return <Navigate to="/admin/login" />;
    }
  } catch (err) {
    // Vid token-fel, neka åtkomst
    return <Navigate to="/admin/login" />;
  }

  // Tillåt åtkomst om allt är OK
  return <Outlet />;
};

export { AdminRouteGuard };
