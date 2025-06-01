"use client";

import {useTheme} from "@/components/provider/theme-provider";
import {Button} from "@/components/ui/button";

export function ThemeToggle() {
  const {theme, setTheme, resolvedTheme} = useTheme();
  
  return (
    <div>
      <p>Current mode: {theme} (Resolved: {resolvedTheme})</p>
      <div className="flex gap-2 mt-2">
        <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme("light")}>Light</Button>
        <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme("dark")}>Dark</Button>
        <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme("system")}>System</Button>
      </div>
    </div>
  );
}