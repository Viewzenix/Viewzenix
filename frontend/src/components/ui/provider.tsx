import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { ColorModeProvider } from "./color-mode";

interface ProviderProps {
  children: ReactNode;
  value?: any;
}

export function Provider({ children, value = defaultSystem }: ProviderProps) {
  return (
    <ChakraProvider value={value}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ColorModeProvider>{children}</ColorModeProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}