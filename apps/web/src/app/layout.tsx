import "./globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes'

import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Create Next App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
