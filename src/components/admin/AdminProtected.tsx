import React from 'react';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  return <>{children}</>;
};
