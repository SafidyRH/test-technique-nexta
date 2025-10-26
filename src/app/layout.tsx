import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ProgressWrapper from "@/shared/context/progress-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextA Crowdfunding",
  description: "Soutenez les projets innovants des TPME malgaches et contribuez au développement de l'écosystème entrepreneurial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressWrapper>
            {children}
        </ProgressWrapper>
      </body>
    </html>
  );
}
