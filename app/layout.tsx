import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "GuruBuddy — Personalized Worksheets for K-8",
  description:
    "AI-powered homework worksheets personalized to your child's grade, interests, and curriculum. Ready to print in 30 seconds.",
  openGraph: {
    title: "GuruBuddy",
    description: "Personalized K-8 homework worksheets, ready to print in 30 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${lexend.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
