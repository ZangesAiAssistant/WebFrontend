"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";

interface LoginButtonProps {
  onLoginSuccess: (token: string) => void;
}

export default function LoginButton({ onLoginSuccess }: LoginButtonProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLoginSuccessCallback = useCallback((authToken: string) => {
    onLoginSuccess(authToken);
  }, [onLoginSuccess]);
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:8000' && event.origin !== window.origin) {
        return;
      }
      if (event.data?.type === 'AUTH_SUCCESS' && typeof event.data?.token === 'string') {
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
  
  useEffect(() => {
    if (token) {
      handleLoginSuccessCallback(token);
      setToken(null);
    }
  }, [token, handleLoginSuccessCallback]);
  
  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
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
      setError('Popup blocked. Please allow popups and try again.');
      setLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      if (!token && popup && !popup.closed) {
        popup.close();
        setLoading(false);
        setError('Authentication timed out. Please try again.');
      }
    }, 60000);
    
    const interval = setInterval(() => {
      if (popup.closed || token) {
        clearInterval(interval);
        clearTimeout(timer);
      }
    }, 500);
  };
  
  return (
    <>
      <Button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login with Google'}
      </Button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </>
  );
}