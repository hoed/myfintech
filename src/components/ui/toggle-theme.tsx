
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/hooks/useAppSettings";

interface ToggleThemeProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  onToggle?: (isDark: boolean) => void;
}

export function ToggleTheme({ 
  variant = "outline", 
  size = "icon", 
  onToggle 
}: ToggleThemeProps) {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting } = useAppSettings();
  
  // Ensure theme is properly synchronized with app settings
  React.useEffect(() => {
    if (settings?.dark_mode !== undefined) {
      const newTheme = settings.dark_mode ? "dark" : "light";
      if (theme !== newTheme) {
        setTheme(newTheme);
      }
    }
  }, [settings?.dark_mode, theme, setTheme]);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    const isDark = newTheme === "dark";
    if (onToggle) {
      onToggle(isDark);
    } else {
      updateSetting({ key: 'dark_mode', value: isDark });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "light" ? "Enable dark mode" : "Enable light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
