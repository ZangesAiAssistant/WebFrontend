"use client";

import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  onLogoutSuccess: () => void;
}

export default function LogoutButton({ onLogoutSuccess }: LogoutButtonProps) {
  const handleLogoutClick = () => {
    onLogoutSuccess();
  };
  
  return (
    <Button onClick={handleLogoutClick}>
      Logout
    </Button>
  );
}
