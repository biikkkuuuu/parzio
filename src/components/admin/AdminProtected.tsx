import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    // If Firebase auth is configured, require both valid Firebase auth AND 2FA session flag
    if (!auth) {
      setIsAuthenticated(false);
      setIsVerifying(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const authStatus = sessionStorage.getItem('parzio_admin_auth');
      if (user && authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Clean any forged or stale sessionStorage
        sessionStorage.removeItem('parzio_admin_auth');
      }
      setIsVerifying(false);
    });

    return () => unsubscribe();
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-[#fed488] gap-3">
        <div className="w-8 h-8 border-2 border-[#fed488] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-wider">VERIFYING ATELIER SECURITY CLEARANCE...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
};
