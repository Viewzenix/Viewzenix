import { Metadata } from "next";
import { ChakraProvider } from "@/components/providers/ChakraProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viewzenix - Trading Webhook Platform",
  description: "Connect TradingView alerts to broker APIs with automated trading rules and risk parameters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ChakraProvider>
          {children}
          <Toaster />
        </ChakraProvider>
      </body>
    </html>
  );
}