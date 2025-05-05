import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ParaProviders } from "@/providers/ParaProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Quadratic Acceleration",
  description: "The Quadratic Accelerator is pioneering a novel tokenization protocol that combines the best features of Quadratic Funding (QF) and Augmented Bonding Curves (ABCs).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-neutral-900`}
      >
        <ParaProviders>
          {children}
        </ParaProviders>
      </body>
    </html>
  );
}
