import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Aurora Atlas",
  description: "An interactive 3D data-poem of a fictional world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-50 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
