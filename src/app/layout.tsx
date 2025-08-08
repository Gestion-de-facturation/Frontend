import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AppLoader from '@/components/spinners/AppLoader';
import LoadingOverlay from "@/components/spinners/LoadingOverlay";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bestplace facturation",
  description: "Gestion de facturation pour Bestplace.mg",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='scroll-smooth'>
      <body>
        <div className="flex">
          <AppLoader />
          <LoadingOverlay/>
          <main className="flex-1 bg-gray-100 min-h-screen">
            <Toaster position="top-right" />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
