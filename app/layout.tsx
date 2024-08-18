import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connexia",
  description: "The new Gen Social Media Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/f1ed3a95ea.js" crossOrigin="anonymous" defer></script>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={`text-sm lg:text-base text-white bg-black ${nunito.className}`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
