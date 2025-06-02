"use client";

import LoginButton from "@/components/login-button";
import LogoutButton from "@/components/logout-button";
import {useEffect, useState} from "react";

export default function LoginArea() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setLoggedIn(!!token);
  }, []);
  
  return (
    <div>
      {loggedIn ? (
        <LoginButton />
      ) : (
        <LogoutButton />
      )}
    </div>
  );
}