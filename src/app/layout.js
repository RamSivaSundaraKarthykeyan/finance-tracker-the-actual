import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Finance Tracker",
  description: "Track and manage your finances with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <NavBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
