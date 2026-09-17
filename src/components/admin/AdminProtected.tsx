import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user already authenticated in this session
    const authStatus = sessionStorage.getItem('parzio_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
};
