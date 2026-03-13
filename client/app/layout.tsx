import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { SupportChatWidget } from "@/components/support-chat-widget";
import { getDemoSession } from "@/lib/auth";
import { getSupportMode } from "@/lib/support-chat-data";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Campus Portal | University ERP",
    template: "%s | Campus Portal",
  },
  description:
    "University portal for admissions, notices, results, documents, and campus services.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getDemoSession();
  const supportMode = getSupportMode(session?.role);

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        {children}
        <SupportChatWidget key={supportMode} mode={supportMode} />
      </body>
    </html>
  );
}
