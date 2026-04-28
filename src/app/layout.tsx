import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/helpers/utils";

import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query.provider";

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
    <ClerkProvider>
      <html
        lang="pt-BR"
        className={cn(
          "font-sans",
          "dark",
          inter.variable,
          montserratHeading.variable,
        )}
      >
        <ReactQueryProvider>
          <body>
            {children}
            <Toaster />
          </body>
        </ReactQueryProvider>
      </html>
    </ClerkProvider>
  );
}
