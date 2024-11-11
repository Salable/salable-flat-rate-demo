import { Inter } from "next/font/google";
import "./globals.css";
import {ToastContainer} from "react-toastify";
import {Header} from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='bg-gray-100'>
      <body className={`${inter.className}`}>
        <Header />
        <div className='py-10'>
          <ToastContainer />
          {children}
        </div>
      </body>
    </html>
  );
}
