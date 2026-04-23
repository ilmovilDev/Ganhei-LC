import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

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
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
