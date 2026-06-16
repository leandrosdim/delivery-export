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

export const metadata = {
  title: "Delivery Export — Εξαγωγή CSV για ERP",
  description: "Συμπληρώστε εύκολα τα στοιχεία παράδοσης και εξάγετε αρχείο CSV έτοιμο για εισαγωγή στο ERP. Απλή, γρήγορη φόρμα χωρίς Excel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}