import { ChakraProvider as ChakraBaseProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

export function ChakraProvider({ children }: ProviderProps) {
  return (
    <ChakraBaseProvider value={defaultSystem}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ChakraBaseProvider>
  );
}