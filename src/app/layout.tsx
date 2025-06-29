import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "ScreenFlowr - Professional Screen Recording & Streaming",
  description:
    "Create stunning screen recordings with real-time annotations, camera overlays, and seamless cloud integration. The professional choice for educators, creators, and teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className='antialiased'>{children}</body>
      </html>
    </ClerkProvider>
  );
}
