import type { Metadata } from "next";

import {IBM_Plex_Sans} from 'next/font/google'
import "./globals.css";

import {
  ClerkProvider,

} from "@clerk/nextjs";
const IBMPLEX = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});



export const metadata: Metadata = {
  title: "Imaginify",
  description: "AI powered Image generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables:{colorPrimary: '#624cf5'}
    }}>
      <html lang="en">
        <body
          className={`${IBMPLEX.variable}  antialiased`}
        >
          
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
