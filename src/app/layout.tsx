import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LegalPro - Protección Legal",
  description: "Suscripción de protección legal para empresas y empleados en Ecuador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}