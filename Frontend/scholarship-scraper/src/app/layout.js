import GoogleMapsProvider from "./components/GoogleMapsProvider";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "NSBE PSU",
  description: "NSBE PSU Chapter",
  icons: [
    { rel: "icon", url: "/nsbe-logo.png" },
    { rel: "shortcut icon", url: "/nsbe-logo.png" },
    { rel: "apple-touch-icon", url: "/nsbe-logo.png" },
  ],
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleMapsProvider>{children}</GoogleMapsProvider>
      </body>
    </html>
  );
}
