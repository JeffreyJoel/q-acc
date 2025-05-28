import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import ClientLayout from "../ClientLayout";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const title = "Sign-In | Quadratic Acceleration";
const description =
  "The Quadratic Accelerator is pioneering a novel tokenization protocol that combines the best features of Quadratic Funding (QF) and Augmented Bonding Curves (ABCs).";
const image = "/images/banners/banner-lg.jpg";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: image,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-neutral-900`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
