import "./globals.css";
import { Inter } from "next/font/google";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MediScan",
  description: "Medical Platform for Patients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} bg-lightBg text-lightText dark:bg-darkBg dark:text-slate-200 min-h-screen`}>
       

        {children}
      </body>
    </html>
  );
}
