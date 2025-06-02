"use client";

import {Button} from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
  };
  
  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
}