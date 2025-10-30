import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spacius Admin - Panel de Administración",
  description: "Panel de administración para la plataforma Spacius de espacios públicos en Guayaquil",
  keywords: ["spacius", "admin", "espacios públicos", "guayaquil", "reservas"],
  authors: [{ name: "Spacius Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#16a34a", // Verde Spacius
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
          {children}
        </div>
      </body>
    </html>
  );
}
