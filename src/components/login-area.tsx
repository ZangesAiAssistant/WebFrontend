"use client";

import { useState, useEffect, useCallback } from 'react';
import LoginButton from "@/components/login-button";
import LogoutButton from "@/components/logout-button";

export default function LoginArea() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  
  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem('authToken');
      setLoggedIn(!!token);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setLoggedIn(false);
    }
  }, []);
  
  useEffect(() => {
    checkAuthStatus();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken') {
        checkAuthStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus]);
  
  const handleLoginSuccess = useCallback((token: string) => {
    try {
      localStorage.setItem('authToken', token);
      setLoggedIn(true);
    } catch (error) {
      console.error("Error setting authToken in localStorage:", error);
    }
  }, []);
  
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('authToken');
      setLoggedIn(false);
    } catch (error)      {
      console.error("Error removing authToken from localStorage:", error);
    }
  }, []);
  
  if (loggedIn === null) {
    return null;
  }
  
  return (
    <div>
      {loggedIn ? (
        <LogoutButton onLogoutSuccess={handleLogout} />
      ) : (
        <LoginButton onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
