import { Suspense } from 'react'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import PokedataProvider from "@/components/PokedataProvider";
import Nav from "@/components/Nav";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kantodex",
  description: "Generation 1 Pokedex with tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
          <PokedataProvider>
            <Nav />
            {children} 
          </PokedataProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
