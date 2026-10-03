import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('parzio_admin_auth') === 'true';
  });

  useEffect(() => {
    if (sessionStorage.getItem('parzio_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
};
