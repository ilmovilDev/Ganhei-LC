import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const montserratHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Ganhei AI",
  description: "Gestão financeira para motoristas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "font-sans",
        // "dark",
        inter.variable,
        montserratHeading.variable,
      )}
    >
      <ClerkProvider>
        <QueryProvider>
          <body>
            {children}
            <Toaster />
          </body>
        </QueryProvider>
      </ClerkProvider>
    </html>
  );
}
