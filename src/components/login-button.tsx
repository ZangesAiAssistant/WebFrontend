"use client";

import {Button} from "@/components/ui/button";
import {SetStateAction, useEffect, useState} from "react";

export default function LoginButton() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [_, setError] = useState("");
  
  useEffect(() => {
    const handleMessage = (event: { origin: string; data: { type: string; token: SetStateAction<null>; error: any; }; }) => {
      if (event.origin !== 'http://localhost:8000') {
        return;
      }
      
      if (event.data?.type === 'AUTH_SUCCESS' && event.data?.token) {
        setToken(event.data.token);
        setLoading(false);
      } else if (event.data?.type === 'AUTH_ERROR') {
        setError(event.data.error || 'Authentication failed');
        setLoading(false);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  const handleGoogleLogin = () => {
    setLoading(true);
    setError("");
    
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    
    const popup = window.open(
      'http://localhost:8000/auth/login',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setError('Popup blocked by the browser. Please allow popups and try again.');
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      if (!token && !popup.closed) {
        popup.close();
        setLoading(false);
        setError('Authentication timed out. Please try again.');
      }
    }, 60000);
  };
  
  const handleLoginSuccess = (authToken: string) => {
    console.log('Authentication successful:', authToken);
    localStorage.setItem('authToken', authToken);
    // You might want to redirect or update UI here
  };
  
  useEffect(() => {
    if (token) {
      handleLoginSuccess(token);
    }
  }, [token]);
  
  return (
    <Button onClick={handleGoogleLogin} disabled={loading}>
      {loading ? 'Logging in...' : 'Login with Google'}
    </Button>
  );
}