import type { Metadata } from "next";
import { Geist_Mono, Syne, Instrument_Serif, Inter, DM_Serif_Display, Playfair_Display, Montserrat, Roboto } from "next/font/google";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rendly",
  description: "Create stunning demo videos with code",
  icons: [
    {
      url: "/favicon.svg",
      rel: "icon",
      type: "image/svg+xml",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SupabaseProvider>
      <SmoothScroll>
      <html lang="en" className={`${syne.variable} ${instrumentSerif.variable} ${geistMono.variable} ${inter.variable} ${dmSerifDisplay.variable} ${playfair.variable} ${montserrat.variable} ${roboto.variable}`} suppressHydrationWarning>
        <body className="h-full flex flex-col antialiased" suppressHydrationWarning>
          {children}
        </body>
      </html>
      </SmoothScroll>
    </SupabaseProvider>
  );
}