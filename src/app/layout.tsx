import "./globals.css";
import { ToastContainer } from 'react-toastify';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body>
        <ToastContainer  autoClose={2000} theme="colored"
         />
        {children}
        </body>
    </html>
  );
}
