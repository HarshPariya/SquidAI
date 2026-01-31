
import type { Metadata } from "next";
import { Fragment } from "react";
import { Geist, Geist_Mono, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { DynamicProviders } from "@/components/auth/dynamic-providers";
import ShapesBackground from "@/components/landing/ShapesBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SquidAI | Ultimate Technical Assistant",
  description: "Your Ultimate Technical Assistant for code, architecture, and problem solving.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${rajdhani.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <DynamicProviders>
          <ShapesBackground key="shapes-bg" />
          <Fragment key="content">{children}</Fragment>
        </DynamicProviders>
      </body>
    </html>
  );
}
