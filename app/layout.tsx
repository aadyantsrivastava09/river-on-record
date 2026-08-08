import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "River on Record — The Public Drain Scoreboard for the Yamuna",
  description:
    "Every drain that kills the Yamuna, rated and published weekly. Built entirely on public government data — DPCC, CPCB, DJB and NGT records, 27 monitoring locations. No hardware. No excuses.",
  keywords: ["Yamuna", "River on Record", "pollution", "drains", "Delhi", "citizen data"],
  icons: { icon: "/logo-round.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-snow">
        {children}
      </body>
    </html>
  );
}
