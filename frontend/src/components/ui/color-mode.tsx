import { useTheme } from "next-themes";
import { Box, IconButton } from "@chakra-ui/react";
import { ReactNode } from "react";

interface ColorModeProviderProps {
  children: ReactNode;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  return (
    <>
      <ThemeToggler />
      {children}
    </>
  );
}

export function ThemeToggler() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Box textAlign="right" py={4} mr={12}>
      <IconButton
        aria-label="Toggle theme"
        icon={isDark ? "sun" : "moon"} 
        onClick={() => setTheme(isDark ? "light" : "dark")} 
        variant="ghost"
      />
    </Box>
  );
}